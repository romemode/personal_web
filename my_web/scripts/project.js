document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginModal = document.getElementById('loginModal');
    const closeButton = document.querySelector('.close-button');

    if (loginButton && loginModal && closeButton) {
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
    }

    const projects = [
        {
            title: "My Resume",
            description: "Click to view my resume",
            icon: "fas fa-file-pdf",
            link: "resume.html"
        }
        // 可以在这里添加更多项目
    ];

    const projectGrid = document.querySelector('.project-grid');
    
    if (projectGrid) {
        projects.forEach(project => {
            const projectCard = document.createElement('a');
            projectCard.href = project.link;
            projectCard.className = 'project-card';
            
            projectCard.innerHTML = `
                <div class="project-icon">
                    <i class="${project.icon}"></i>
                </div>
                <div class="project-content">
                    <h2 class="project-title">${project.title}</h2>
                    <p class="project-description">${project.description}</p>
                </div>
            `;
            
            projectGrid.appendChild(projectCard);
        });
    }
});