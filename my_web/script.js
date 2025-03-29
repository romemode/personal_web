function updateTime() {
    const now = new Date();
    
    // 更新时间
    const timeElement = document.getElementById('current-time');
    timeElement.textContent = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    
    // 更新日期
    const dateElement = document.getElementById('current-date');
    const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 ${weekDays[now.getDay()]}`;
    dateElement.textContent = dateStr;
}

// 当页面加载完成后开始动画和时间更新
document.addEventListener('DOMContentLoaded', () => {
    // 开始时间更新
    updateTime();
    setInterval(updateTime, 1000);

    // 打字机效果
    const titleElement = document.querySelector('.typewriter');
    typeWriter(titleElement, 'Yide Lin', 150);

    // 添加延迟显示其他元素
    setTimeout(() => {
        document.querySelector('.subtitle').classList.add('fade-in');
    }, 2000);

    // 为每个section添加渐入效果
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        setTimeout(() => {
            section.classList.add('fade-in');
        }, 2500 + index * 200);
    });

    // 导航切换
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            
            // 更新导航激活状态
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // 显示对应部分
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active');
                } else {
                    section.classList.remove('active');
                }
            });
        });
    });

    // 登录按钮处理
    const loginButtons = document.querySelectorAll('.login-btn');
    const loginPrompt = document.querySelector('.login-prompt');
    const messageInput = document.querySelector('.message-input');

    loginButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('anonymous')) {
                // 直接显示留言输入框
                loginPrompt.classList.add('hidden');
                messageInput.classList.remove('hidden');
            } else if (button.classList.contains('google')) {
                // 处理Google登录
                handleGoogleLogin();
            } else if (button.classList.contains('github')) {
                // 处理GitHub登录
                handleGithubLogin();
            }
        });
    });
});

function typeWriter(element, text, speed = 100) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// 登录处理函数
function handleGoogleLogin() {
    // 实现Google登录逻辑
    console.log('Google登录');
}

function handleGithubLogin() {
    // 实现GitHub登录逻辑
    console.log('GitHub登录');
}

// 添加消息到展示区域
function addMessage(message, user) {
    const messagesContainer = document.querySelector('.messages-container');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message-item');
    messageElement.innerHTML = `
        <div class="message-header">
            <img src="${user.avatar}" alt="${user.name}" class="message-avatar">
            <div class="message-info">
                <div class="message-author">${user.name}</div>
                <div class="message-time">${new Date().toLocaleString()}</div>
            </div>
        </div>
        <div class="message-content">${message}</div>
    `;
    messagesContainer.prepend(messageElement);
} 