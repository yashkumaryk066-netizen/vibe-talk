import React, { useEffect, useState } from 'react';
import { useCall } from '../context/CallContext';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from 'lucide-react';

const CallOverlay = () => {
    const { callState, callType, localStream, remoteStream, acceptCall, endCall, callerInfo } = useCall();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        let interval;
        if (callState === 'connected') {
            interval = setInterval(() => setDuration(d => d + 1), 1000);
        } else {
            setDuration(0);
        }
        return () => clearInterval(interval);
    }, [callState]);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsVideoOff(!isVideoOff);
        }
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    if (callState === 'idle') return null;

    return (
        <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in fade-in duration-300">

            {/* Background Ambience */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 pointer-events-none"></div>

            {callState === 'connected' && callType === 'video' && remoteStream && (
                <video
                    autoPlay
                    playsInline
                    ref={video => {
                        if (video && video.srcObject !== remoteStream) video.srcObject = remoteStream;
                    }}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            )}

            {/* Main Container */}
            <div className="relative z-10 flex flex-col items-center w-full max-w-md h-full justify-between py-12">

                {/* Header / Remote Info */}
                <div className="flex flex-col items-center">
                    {(!remoteStream || callType === 'audio') && (
                        <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden mb-6 shadow-2xl animate-pulse">
                            <img src={callerInfo?.profile_pic || `https://api.dicebear.com/7.x/avataaars/svg?seed=${callerInfo?.username}`} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-lg">{callerInfo?.username || 'Unknown'}</h2>
                    <p className="text-white/70 mt-2 font-mono text-lg">
                        {callState === 'calling' && 'Calling...'}
                        {callState === 'incoming' && 'Incoming Call...'}
                        {callState === 'connecting' && 'Connecting...'}
                        {callState === 'connected' && formatTime(duration)}
                    </p>
                </div>

                {/* Local Video (PiP) */}
                {callState === 'connected' && callType === 'video' && localStream && (
                    <div className="absolute top-8 right-4 w-28 h-40 bg-gray-900 rounded-xl overflow-hidden border border-white/20 shadow-xl">
                        <video
                            autoPlay
                            playsInline
                            muted
                            ref={video => {
                                if (video && video.srcObject !== localStream) video.srcObject = localStream;
                            }}
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-8 mb-8">
                    {callState === 'incoming' ? (
                        <>
                            <button onClick={() => endCall(false)} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition transform hover:scale-110">
                                <PhoneOff size={32} />
                            </button>
                            <button onClick={acceptCall} className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center text-white shadow-lg shadow-green-500/30 transition transform hover:scale-110 animate-bounce">
                                <Phone size={32} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={toggleMute} className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur text-white transition ${isMuted ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>
                                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                            </button>

                            <button onClick={() => endCall(true)} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition transform hover:scale-110">
                                <PhoneOff size={32} />
                            </button>

                            {callType === 'video' && (
                                <button onClick={toggleVideo} className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur text-white transition ${isVideoOff ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>
                                    {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
                                </button>
                            )}
                        </>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CallOverlay;
