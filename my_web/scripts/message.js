document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.querySelector('.message-input');
    const nameInput = document.querySelector('.name-input');
    const sendButton = document.querySelector('.send-button');
    const messagesList = document.querySelector('.messages-list');

    // 头像数组
    const avatars = [
        '../assets/avatar1.jpg',
        '../assets/avatar2.jpg',
        '../assets/avatar3.jpg',
        '../assets/avatar4.jpg',
        '../assets/avatar5.jpg'
    ];

    let lastAvatarIndex = -1;
    let usedAvatars = new Set(); // 用于追踪最近使用的头像

    // 获取随机头像，避免连续重复
    function getRandomAvatar() {
        // 如果所有头像都被使用了，重置使用记录
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

    // 显示消息
    function displayMessage(content, avatar, time, author, isNew = true) {
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
            <div class="message-content">
                ${content}
            </div>
            <div class="message-line"></div>
        `;

        messagesList.insertBefore(messageElement, messagesList.firstChild);
    }

    // 保存消息到 localStorage
    function saveMessage(content, avatar, time, author) {
        const savedMessages = localStorage.getItem('messages');
        const messages = savedMessages ? JSON.parse(savedMessages) : [];
        messages.unshift({ content, avatar, time, author });
        localStorage.setItem('messages', JSON.stringify(messages));
    }

    function sendMessage() {
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

        // 显示消息
        displayMessage(message, randomAvatar, currentTime, author);

        // 保存消息
        saveMessage(message, randomAvatar, currentTime, author);
        
        // 清空消息输入框
        messageInput.value = '';
        messageInput.style.height = '40px';
    }

    // 事件监听器
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // 自动调整输入框高度
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = messageInput.scrollHeight + 'px';
    });

    // 加载保存的消息
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
        const messages = JSON.parse(savedMessages);
        messages.forEach(msg => {
            displayMessage(msg.content, msg.avatar, msg.time, msg.author, false);
        });
    }
}); 
