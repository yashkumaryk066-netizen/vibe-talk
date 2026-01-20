// 🔌 VibeTalk WebSocket Client
// Developer: Yash Ankush Mishra (Rangra Developer)

class WebSocketClient {
    constructor() {
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.messageHandlers = [];
    }

    connect(roomId, type = 'chat', onMessage) {
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsHost = import.meta.env.VITE_WS_URL || window.location.host;
        const wsUrl = `${wsProtocol}//${wsHost}/ws/${type}/${roomId}/`;

        console.log('🔌 Connecting to WebSocket:', wsUrl);

        this.socket = new WebSocket(wsUrl);

        this.socket.onopen = () => {
            console.log('✅ WebSocket Connected!');
            this.reconnectAttempts = 0;
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('📨 WebSocket Message:', data);
            if (onMessage) onMessage(data);
            this.messageHandlers.forEach(handler => handler(data));
        };

        this.socket.onerror = (error) => {
            console.error('❌ WebSocket Error:', error);
        };

        this.socket.onclose = () => {
            console.log('🔌 WebSocket Disconnected');
            this.attemptReconnect(roomId, type, onMessage);
        };

        return this.socket;
    }

    attemptReconnect(roomId, type, onMessage) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
            setTimeout(() => {
                this.connect(roomId, type, onMessage);
            }, this.reconnectDelay);
        } else {
            console.error('❌ Max reconnection attempts reached');
        }
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
            return true;
        } else {
            console.warn('⚠️ WebSocket not connected');
            return false;
        }
    }

    sendMessage(message) {
        return this.send({
            type: 'chat_message',
            message: message
        });
    }

    sendTyping(isTyping) {
        return this.send({
            type: 'typing',
            is_typing: isTyping
        });
    }

    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }

    removeMessageHandler(handler) {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
            console.log('🔌 WebSocket Manually Disconnected');
        }
    }
}

// Singleton instance
export const wsClient = new WebSocketClient();
export default wsClient;
