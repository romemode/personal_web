document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.querySelector('.message-input');
    const nameInput = document.querySelector('.name-input');
    const sendButton = document.querySelector('.send-button');
    const messagesList = document.querySelector('.messages-list');
    const messageTemplate = document.getElementById('message-template').innerHTML;

    // 头像数组
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

    // 生成唯一ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // 显示消息
    function displayMessage(content, avatar, time, author, messageId, replies = [], isNew = true) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message-item';
        messageElement.dataset.messageId = messageId;
        
        // 使用模板替换变量
        let messageHtml = messageTemplate
            .replace('${avatar}', avatar)
            .replace('${author || \'Anonymous\'}', author || 'Anonymous')
            .replace('${time}', time)
            .replace('${content}', content)
            .replace(/\${messageId}/g, messageId);
        
        messageElement.innerHTML = messageHtml;

        // 添加回复按钮事件
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
                
                // 添加回复
                addReply(messageId, replyContent, replyAvatar, replyTime, replyAuthor);
                
                // 清空并隐藏回复表单
                replyInput.value = '';
                replyForm.classList.remove('active');
            });
        }, 0);
        
        // 显示已有的回复
        if (replies && replies.length > 0) {
            const repliesContainer = messageElement.querySelector(`.replies-container`);
            replies.forEach(reply => {
                displayReply(repliesContainer, reply.content, reply.avatar, reply.time, reply.author);
            });
        }

        messagesList.insertBefore(messageElement, messagesList.firstChild);
        return messageElement;
    }
    
    // 显示回复
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
    
    // 添加回复
    function addReply(messageId, content, avatar, time, author) {
        // 保存回复到localStorage
        const savedMessages = localStorage.getItem('messages');
        const messages = savedMessages ? JSON.parse(savedMessages) : [];
        
        const messageIndex = messages.findIndex(msg => msg.id === messageId);
        if (messageIndex !== -1) {
            if (!messages[messageIndex].replies) {
                messages[messageIndex].replies = [];
            }
            
            const reply = { content, avatar, time, author };
            messages[messageIndex].replies.push(reply);
            localStorage.setItem('messages', JSON.stringify(messages));
            
            // 显示回复
            const messageElement = document.querySelector(`.message-item[data-message-id="${messageId}"]`);
            const repliesContainer = messageElement.querySelector('.replies-container');
            displayReply(repliesContainer, content, avatar, time, author);
        }
    }

    // 保存消息到 localStorage
    function saveMessage(content, avatar, time, author, messageId, replies = []) {
        const savedMessages = localStorage.getItem('messages');
        const messages = savedMessages ? JSON.parse(savedMessages) : [];
        messages.unshift({ id: messageId, content, avatar, time, author, replies });
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
        const messageId = generateId();

        // 显示消息
        displayMessage(message, randomAvatar, currentTime, author, messageId, []);

        // 保存消息
        saveMessage(message, randomAvatar, currentTime, author, messageId, []);
        
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
        
        // 检查并更新旧格式的消息数据
        const updatedMessages = messages.map(msg => {
            if (!msg.id) {
                msg.id = generateId();
            }
            if (!msg.replies) {
                msg.replies = [];
            }
            return msg;
        });
        
        // 如果有更新，保存回localStorage
        if (JSON.stringify(messages) !== JSON.stringify(updatedMessages)) {
            localStorage.setItem('messages', JSON.stringify(updatedMessages));
        }
        
        updatedMessages.forEach(msg => {
            displayMessage(msg.content, msg.avatar, msg.time, msg.author, msg.id, msg.replies, false);
        });
    }
});
