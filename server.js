// server.js —— 放在仓库根目录
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

console.log('✅ WebSocket 服务器已启动');

// 存储所有连接的客户端
const clients = new Set();

wss.on('connection', (ws) => {
    console.log('🔌 新用户连接');
    clients.add(ws);

    ws.on('message', (data) => {
        try {
            const msg = JSON.parse(data);
            console.log('📨 收到消息:', msg);

            // 广播给所有客户端（包括自己）
            clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(msg));
                }
            });
        } catch (e) {
            console.error('❌ 消息解析失败:', e);
        }
    });

    ws.on('close', () => {
        console.log('🔌 用户断开');
        clients.delete(ws);
    });
});
