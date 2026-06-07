// js/websocket.js
class ChatWebSocket {
    constructor() {
        this.ws = null;
        this.isConnected = false;
        this.reconnectInterval = 3000;
        this.init();
    }

    init() {
        this.connect();
    }

    connect() {
        this.ws = new WebSocket('wss://your-server-url/ws'); // 替换为你的服务器地址

        this.ws.onopen = () => {
            console.log('✅ WebSocket 已连接');
            this.isConnected = true;
            this.onConnected?.();
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.onMessage?.(data);
            } catch (e) {
                console.error('❌ 消息解析失败:', e);
            }
        };

        this.ws.onclose = () => {
            console.log('❌ WebSocket 断开，3秒后重连');
            this.isConnected = false;
            setTimeout(() => this.connect(), this.reconnectInterval);
        };

        this.ws.onerror = (err) => {
            console.error('⚠️ WebSocket 错误:', err);
        };
    }

    send(message) {
        if (this.isConnected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn('⚠️ 未连接，消息发送失败');
        }
    }

    onConnected = null;
    onMessage = null;
}
