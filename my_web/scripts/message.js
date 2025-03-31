import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js';
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyC5f7HOu--ecfKHVHHyh6190u1SGqu0r0",
    authDomain: "myweb-31c5c.firebaseapp.com",
    projectId: "myweb-31c5c",
    storageBucket: "myweb-31c5c.appspot.com",
    messagingSenderId: "700628302270",
    appId: "1:700628302270:web:55dbf72a3883f91bc142ef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, 'messages');

const messageInput = document.querySelector('.message-input');
const nameInput = document.querySelector('.name-input');
const sendButton = document.querySelector('.send-button');
const messagesList = document.querySelector('.messages-list');

// 随机头像逻辑
const avatars = [
    '../assets/avatar1.jpg',
    '../assets/avatar2.jpg',
    '../assets/avatar3.jpg',
    '../assets/avatar4.jpg',
    '../assets/avatar5.jpg'
];

let lastAvatarIndex = -1;
let usedAvatars = new Set();

function getRandomAvatar() {
    if (usedAvatars.size >= avatars.length - 1) usedAvatars.clear();
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * avatars.length);
    } while (randomIndex === lastAvatarIndex || usedAvatars.has(randomIndex));
    lastAvatarIndex = randomIndex;
    usedAvatars.add(randomIndex);
    return avatars[randomIndex];
}

// 显示留言
function displayMessage(content, avatar, time, author) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message-item';
    messageElement.innerHTML = `
        <div class="message-header">
            <img src="${avatar}" alt="User Avatar" class="message-avatar" onerror="this.src='../assets/avatar1.jpg'">
            <div class="message-info">
                <span class="message-author">${author || 'Anonymous'}</span>
                <span class="message-time">${time}</span>
            </div>
        </div>
        <div class="message-content">${content}</div>
        <div class="message-line"></div>
    `;
    messagesList.insertBefore(messageElement, messagesList.firstChild);
}

// 发送留言
async function sendMessage() {
    const content = messageInput.value.trim();
    if (!content) return;

    const author = nameInput.value.trim() || 'Anonymous';
    const avatar = getRandomAvatar();

    await addDoc(messagesRef, {
        content,
        author,
        avatar,
        time: serverTimestamp()
    });

    messageInput.value = '';
    messageInput.style.height = '40px';
}

// 事件绑定
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
messageInput.addEventListener('input', () => {
    messageInput.style.height = 'auto';
    messageInput.style.height = messageInput.scrollHeight + 'px';
});

// 实时监听留言
const q = query(messagesRef, orderBy('time', 'desc'));
onSnapshot(q, (snapshot) => {
    messagesList.innerHTML = '';
    snapshot.forEach(doc => {
        const msg = doc.data();
        const displayTime = msg.time?.toDate().toLocaleString('zh-CN') || '刚刚';
        displayMessage(msg.content, msg.avatar, displayTime, msg.author);
    });
});
