import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const CallContext = createContext();

export const useCall = () => useContext(CallContext);

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:global.stun.twilio.com:3478' }
    ]
};

export const CallProvider = ({ children, user }) => {
    const [callState, setCallState] = useState('idle'); // idle, calling, incoming, connected
    const [callType, setCallType] = useState('audio'); // audio, video
    const [remoteStream, setRemoteStream] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const [callerInfo, setCallerInfo] = useState(null);

    const peerRef = useRef(null);
    const socketRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const currentRoomId = useRef(null);

    // --- WebSocket Management for Voice Room ---
    const connectToVoiceSocket = (roomId) => {
        if (socketRef.current) return;

        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = import.meta.env.VITE_WS_URL || window.location.host;
        const wsUrl = `${wsProtocol}//${wsHost}/ws/voice/${roomId}/`; // Using existing backend route

        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log('✅ Voice WebSocket Connected');
        };

        socket.onmessage = async (event) => {
            const msg = JSON.parse(event.data);
            handleSignalingData(msg);
        };

        socketRef.current = socket;
    };

    const disconnectVoiceSocket = () => {
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
    };

    // --- WebRTC Signaling Handlers ---
    const handleSignalingData = async (msg) => {
        if (msg.sender === user.username) return; // Ignore own messages

        switch (msg.type) {
            case 'user_joined':
                // If we are the caller and someone joined, initiate offer
                if (callState === 'calling') {
                    createOffer();
                }
                break;

            case 'webrtc_signal':
                const data = msg.data;
                if (data.type === 'offer') {
                    handleOffer(data, msg.sender);
                } else if (data.type === 'answer') {
                    handleAnswer(data);
                } else if (data.candidate) {
                    handleCandidate(data);
                }
                break;

            case 'end_call':
                endCall(false);
                toast("Call ended");
                break;
        }
    };

    const createPeerConnection = () => {
        if (peerRef.current) return;

        const peer = new RTCPeerConnection(ICE_SERVERS);

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                sendSignal({ candidate: event.candidate });
            }
        };

        peer.ontrack = (event) => {
            console.log('🎥 Remote Stream Received');
            setRemoteStream(event.streams[0]);
        };

        if (localStream) {
            localStream.getTracks().forEach(track => {
                peer.addTrack(track, localStream);
            });
        }

        peerRef.current = peer;
    };

    const createOffer = async () => {
        createPeerConnection();
        try {
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            sendSignal(offer);
        } catch (err) {
            console.error('Error creating offer:', err);
        }
    };

    const handleOffer = async (offer, sender) => {
        // If we are getting an offer, we must be in 'incoming' or ready state
        // But since we are using VoiceSocket, we assume we already 'Accepted' the invite
        // and joined the room.
        createPeerConnection();
        try {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
            const answer = await peerRef.current.createAnswer();
            await peerRef.current.setLocalDescription(answer);
            sendSignal(answer);
            setCallState('connected');
        } catch (err) {
            console.error('Error handling offer:', err);
        }
    };

    const handleAnswer = async (answer) => {
        try {
            await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
            setCallState('connected');
        } catch (err) {
            console.error('Error handling answer:', err);
        }
    };

    const handleCandidate = async (candidate) => {
        try {
            if (peerRef.current) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (err) {
            console.error('Error adding candidate:', err);
        }
    };

    const sendSignal = (data) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: 'webrtc_signal',
                data: data
            }));
        }
    };

    // --- Public Actions ---

    const startCall = async (roomId, type = 'audio', otherUser) => {
        currentRoomId.current = roomId;
        setCallType(type);
        setCallState('calling');
        setCallerInfo(otherUser);

        // Get Media
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: type === 'video',
                audio: true
            });
            setLocalStream(stream);

            // Connect to Socket
            connectToVoiceSocket(roomId);

            // Send Invite (Need to coordinate with Chat Socket or relying on user joining Voice room)
            // Ideally here we send a 'CALL_INVITE' message via the Chat REST API or Chat Socket
            // so the other user sees "Incoming Call" button.

        } catch (err) {
            console.error("Media Error:", err);
            toast.error(`Could not access ${type} device`);
            setCallState('idle');
        }
    };

    const incomingCall = (roomId, type, caller) => {
        currentRoomId.current = roomId;
        setCallType(type);
        setCallerInfo(caller);
        setCallState('incoming');
    };

    const acceptCall = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: callType === 'video',
                audio: true
            });
            setLocalStream(stream);

            connectToVoiceSocket(currentRoomId.current);
            // Wait for 'user_joined' or Offer from caller
            setCallState('connecting');

        } catch (err) {
            console.error("Media Error:", err);
            toast.error(`Could not access ${callType} device`);
            endCall();
        }
    };

    const endCall = (notify = true) => {
        if (notify && socketRef.current) {
            // ideally send 'end_call' signal
            socketRef.current.send(JSON.stringify({ type: 'end_call' }));
        }

        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        setRemoteStream(null);

        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }

        disconnectVoiceSocket();
        setCallState('idle');
        setCallerInfo(null);
    };

    return (
        <CallContext.Provider value={{
            callState,
            callType,
            localStream,
            remoteStream,
            startCall,
            acceptCall,
            endCall,
            incomingCall, // Call this when ChatSocket receives invitation
            callerInfo
        }}>
            {children}
        </CallContext.Provider>
    );
};
