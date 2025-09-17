document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeButton = document.querySelector('.close-button');
    
    loginButton.addEventListener('click', () => {
        loginModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeButton.addEventListener('click', () => {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

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

function handleGithubLogin() {
    console.log('GitHub login');
}

function handleGoogleLogin() {
    console.log('Google login');
}

function checkLoginStatus() {

} 
