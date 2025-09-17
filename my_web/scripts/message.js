import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, arrayUnion, query, orderBy, limit, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC5f7HU_U--ecfKIHVHIyh619UOs1SGQU8",
    authDomain: "myweb-31c5c.firebaseapp.com",
    projectId: "myweb-31c5c",
    storageBucket: "myweb-31c5c.firebasestorage.app",
    messagingSenderId: "700628302270",
    appId: "1:700628302270:web:55fd72a38839f31bc421ef",
    measurementId: "G-E1VMNJW386"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.querySelector('.message-input');
    const nameInput = document.querySelector('.name-input');
    const sendButton = document.querySelector('.send-button');
    const messagesList = document.querySelector('.messages-list');
    const messageTemplate = document.getElementById('message-template').innerHTML;

    const avatars = [
        '../assets/avatar1.jpg',
        '../assets/avatar2.jpg',
        '../assets/avatar3.jpg',
        '../assets/avatar4.jpg',
        '../assets/avatar5.jpg',
        '../assets/avatar6.jpg',
        '../assets/avatar7.jpg',
        '../assets/avatar8.jpg',
        '../assets/avatar9.jpg',
        '../assets/avatar10.jpg',
        '../assets/avatar11.jpg',
        '../assets/avatar12.jpg',
    ];

    let lastAvatarIndex = -1;
    let usedAvatars = new Set();

    function getRandomAvatar() {
        if (usedAvatars.size >= avatars.length - 1) {
            usedAvatars.clear();
        }

        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * avatars.length);
        } while (randomIndex === lastAvatarIndex || usedAvatars.has(randomIndex));

        lastAvatarIndex = randomIndex;
        usedAvatars.add(randomIndex);
        return avatars[randomIndex];
    }

    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    function displayMessage(content, avatar, time, author, messageId, replies = [], isNew = true) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-item';
        messageElement.dataset.messageId = messageId;
        
        let messageHtml = messageTemplate
            .replace('${avatar}', avatar)
            .replace('${author || \'Anonymous\'}', author || 'Anonymous')
            .replace('${time}', time)
            .replace('${content}', content)
            .replace(/\${messageId}/g, messageId);
        
        messageElement.innerHTML = messageHtml;

        setTimeout(() => {
            const replyButton = messageElement.querySelector('.reply-button');
            const replyForm = messageElement.querySelector('.reply-form');
            const cancelButton = messageElement.querySelector('.reply-cancel-button');
            const replyInput = messageElement.querySelector('.reply-input');
            const replyNameInput = messageElement.querySelector('.reply-name-input');
            const replySendButton = messageElement.querySelector('.reply-send-button');
            
            replyButton.addEventListener('click', () => {
                replyForm.classList.add('active');
                replyInput.focus();
            });
            
            cancelButton.addEventListener('click', () => {
                replyForm.classList.remove('active');
                replyInput.value = '';
            });
            
            replySendButton.addEventListener('click', () => {
                const replyContent = replyInput.value.trim();
                if (!replyContent) return;
                
                const replyAuthor = replyNameInput.value.trim() || 'Anonymous';
                const replyAvatar = getRandomAvatar();
                const replyTime = new Date().toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                });
                
                addReply(messageId, replyContent, replyAvatar, replyTime, replyAuthor);
                
                replyInput.value = '';
                replyForm.classList.remove('active');
            });
        }, 0);
        
        if (replies && replies.length > 0) {
            const repliesContainer = messageElement.querySelector(`.replies-container`);
            repliesContainer.innerHTML = '';
            console.log(`显示消息 ${messageId} 的 ${replies.length} 条回复`);
            replies.forEach(reply => {
                displayReply(repliesContainer, reply.content, reply.avatar, reply.time, reply.author);
            });
        }

        messagesList.insertBefore(messageElement, messagesList.firstChild);
        return messageElement;
    }
    
    function displayReply(container, content, avatar, time, author) {
        const replyElement = document.createElement('div');
        replyElement.className = 'reply-item';
        
        replyElement.innerHTML = `
            <div class="reply-header">
                <img src="${avatar}" alt="User Avatar" class="reply-avatar" onerror="this.src='../assets/avatar1.jpg'">
                <div class="reply-info">
                    <span class="reply-author">${author || 'Anonymous'}</span>
                    <span class="reply-time">${time}</span>
                </div>
            </div>
            <div class="reply-content">
                ${content}
            </div>
        `;
        
        container.appendChild(replyElement);
        return replyElement;
    }
    
    async function addReply(messageId, content, avatar, time, author) {
        try {
            const messageElement = document.querySelector(`.message-item[data-message-id="${messageId}"]`);
            if (!messageElement) {
                console.error("未找到消息元素，ID:", messageId);
                return;
            }
            
            let docId = messageElement.dataset.firebaseId;
            
            if (!docId) {
                console.log("未找到存储的Firebase ID，尝试通过查询获取");
                const messagesRef = collection(db, "messages");
                const q = query(messagesRef, where("id", "==", messageId));
                const querySnapshot = await getDocs(q);
                
                if (querySnapshot.empty) {
                    console.error("未找到消息ID为", messageId, "的文档");
                    return;
                }
                
                docId = querySnapshot.docs[0].id;
                messageElement.dataset.firebaseId = docId;
                console.log("已找到并存储Firebase ID:", docId);
            }
            
            const messageRef = doc(db, "messages", docId);
            
            await updateDoc(messageRef, {
                replies: arrayUnion({
                    content, 
                    avatar, 
                    time, 
                    author
                })
            });
            
            const repliesContainer = messageElement.querySelector('.replies-container');
            displayReply(repliesContainer, content, avatar, time, author);
            console.log("回复已添加到文档:", docId);
        } catch (error) {
            console.error("添加回复时出错:", error);
        }
    }

    async function saveMessage(content, avatar, time, author, messageId, replies = []) {
        try {
            const docRef = await addDoc(collection(db, "messages"), {
                id: messageId,
                content,
                avatar,
                time,
                author,
                replies,
                timestamp: new Date()
            });
            
            const messageElement = document.querySelector(`.message-item[data-message-id="${messageId}"]`);
            if (messageElement) {
                messageElement.dataset.firebaseId = docRef.id;
            }
            
            console.log("消息已保存，Firebase ID:", docRef.id, "自定义ID:", messageId);
        } catch (error) {
            console.error("保存消息时出错:", error);
        }
    }

    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        const author = nameInput.value.trim() || 'Anonymous';
        const randomAvatar = getRandomAvatar();
        const currentTime = new Date().toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const messageId = generateId();

        displayMessage(message, randomAvatar, currentTime, author, messageId, []);

        await saveMessage(message, randomAvatar, currentTime, author, messageId, []);
        
        messageInput.value = '';
        messageInput.style.height = '40px';
    }

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

    function loadMessages() {
        try {
            const q = query(collection(db, "messages"), orderBy("timestamp", "desc"), limit(50));
            
            const unsubscribe = onSnapshot(q, { includeMetadataChanges: true }, (querySnapshot) => {
                console.log("检测到数据变化，类型:", querySnapshot.metadata.hasPendingWrites ? "本地" : "服务器");
                
                messagesList.innerHTML = '';
                
                if (querySnapshot.empty) {
                    console.log("没有消息数据");
                    return;
                }
                
                querySnapshot.forEach((doc) => {
                    const msgData = doc.data();
                    if (!msgData || !msgData.id) {
                        console.warn("跳过无效文档:", doc.id);
                        return;
                    }
                    
                    const messageElement = displayMessage(
                        msgData.content, 
                        msgData.avatar, 
                        msgData.time, 
                        msgData.author, 
                        msgData.id, 
                        msgData.replies || [], 
                        false
                    );
                    
                    if (messageElement) {
                        messageElement.dataset.firebaseId = doc.id;
                        console.log("已加载消息，Firebase ID:", doc.id, "自定义ID:", msgData.id);
                    }
                });
                
                console.log("实时数据监听已设置，消息列表已更新，文档数量:", querySnapshot.size);
            }, (error) => {
                console.error("监听消息变化时出错:", error);
            });
            
            return unsubscribe;
        } catch (error) {
            console.error("设置消息监听时出错:", error);
        }
    }

    loadMessages();
});

