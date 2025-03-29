document.addEventListener('DOMContentLoaded', () => {
    // 登录相关代码
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeButton = document.querySelector('.close-button');
    
    // 打开登录弹窗
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    // 关闭登录弹窗
    closeButton.addEventListener('click', () => {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    // 点击弹窗外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 处理登录按钮点击
    const loginButtons = document.querySelectorAll('.login-btn');
    loginButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('github')) {
                handleGithubLogin();
            } else if (button.classList.contains('google')) {
                handleGoogleLogin();
            }
        });
    });
});

// 登录处理函数
function handleGithubLogin() {
    console.log('GitHub login');
    // 实现GitHub登录逻辑
}

function handleGoogleLogin() {
    console.log('Google login');
    // 实现Google登录逻辑
}

// 检查登录状态
function checkLoginStatus() {
    // 实现检查登录状态的逻辑
    // 如果已登录，更新用户头像和界面状态
} 