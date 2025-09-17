document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('mobileMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            menu.classList.toggle('active');
        });

        const links = menu.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }

    const typewriterElement = document.querySelector('.typewriter');
    const text = "Hi, I'm Yide Lin";
    let index = 0;

    function type() {
        if (index < text.length) {
            typewriterElement.textContent += text.charAt(index);
            index++;
            setTimeout(type, 150); // type speed
        }
    }

    type();

    setTimeout(() => {
        document.querySelector('.subtitle').style.opacity = '1';
        document.querySelector('.subtitle').style.transform = 'translateY(0)';
    }, 2000);

    setTimeout(() => {
        document.querySelector('.subtitle-cn').style.opacity = '1';
        document.querySelector('.subtitle-cn').style.transform = 'translateY(0)';
    }, 2500);

    setTimeout(() => {
        document.querySelector('.about-me-container').style.opacity = '1';
        document.querySelector('.about-me-container').style.transform = 'translateY(0)';
    }, 3500);

    setTimeout(() => {
        document.querySelector('.channel-container').style.opacity = '1';
        document.querySelector('.channel-container').style.transform = 'translateY(0)';
    }, 4000);

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
                console.log('GitHub login');
            } else if (button.classList.contains('google')) {
                console.log('Google login');
            }
        });
    });
});

