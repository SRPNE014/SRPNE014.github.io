<script>
/* ===== 模拟当前用户（Firebase 接入后直接替换）===== */
const currentUser = {
    uid: "me",
    nickname: "夏洛希",
    avatar: "夏"
};

/* ===== 文本消息 ===== */
function sendText() {
    const input = document.getElementById("textInput");
    if (!input.value.trim()) return;

    renderMessage({
        text: input.value,
        isMe: true
    });

    input.value = "";
}

/* ===== 语音消息 ===== */
let mediaRecorder;
let audioChunks = [];

async function startVoice() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.start();
    document.getElementById("micBtn").classList.add("recording");
}

mediaRecorder?.addEventListener("stop", async () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const base64 = await blobToBase64(blob);
    renderVoice(base64);
});

function stopVoice() {
    mediaRecorder?.stop();
    document.getElementById("micBtn").classList.remove("recording");
}

/* ===== 渲染消息 ===== */
function renderMessage({ text, isMe }) {
    const wrapper = document.createElement("div");
    wrapper.className = "msg-wrapper " + (isMe ? "me" : "");

    const avatar = document.createElement("div");
    avatar.className = "avatar-mini";
    avatar.textContent = isMe ? currentUser.avatar : "?";

    const content = document.createElement("div");

    const nick = document.createElement("div");
    nick.className = "nickname";
    nick.textContent = isMe ? currentUser.nickname : "访客";

    const msg = document.createElement("div");
    msg.className = "msg";
    msg.textContent = text;

    content.appendChild(nick);
    content.appendChild(msg);
    wrapper.appendChild(avatar);
    wrapper.appendChild(content);

    document.getElementById("messages").appendChild(wrapper);
    scrollBottom();
}

/* ===== 渲染语音 ===== */
function renderVoice(base64) {
    const wrapper = document.createElement("div");
    wrapper.className = "msg-wrapper me";

    const avatar = document.createElement("div");
    avatar.className = "avatar-mini";
    avatar.textContent = currentUser.avatar;

    const content = document.createElement("div");

    const nick = document.createElement("div");
    nick.className = "nickname";
    nick.textContent = currentUser.nickname;

    const voice = document.createElement("div");
    voice.className = "voice-msg";
    voice.innerHTML = `
        <div class="voice-wave">
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
            <div class="wave-bar"></div>
        </div>
        <div class="voice-duration">点击播放</div>
    `;

    voice.onclick = () => new Audio(base64).play();

    content.appendChild(nick);
    content.appendChild(voice);
    wrapper.appendChild(avatar);
    wrapper.appendChild(content);

    document.getElementById("messages").appendChild(wrapper);
    scrollBottom();
}

function scrollBottom() {
    const box = document.getElementById("messages");
    box.scrollTop = box.scrollHeight;
}

function blobToBase64(blob) {
    return new Promise(resolve => {
        const r = new FileReader();
        r.onloadend = () => resolve(r.result);
        r.readAsDataURL(blob);
    });
}
</script>
