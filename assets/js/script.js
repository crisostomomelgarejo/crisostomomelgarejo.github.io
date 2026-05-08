// Theme Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggleBtn.querySelector('i');

// Check for saved theme preference or use system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    htmlElement.setAttribute('data-theme', savedTheme);
    updateIcon(savedTheme);
} else if (!systemPrefersDark) {
    htmlElement.setAttribute('data-theme', 'light');
    updateIcon('light');
}

// Toggle Theme on Button Click
themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateIcon(newTheme);
});

function updateIcon(theme) {
    if (theme === 'light') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Optional: Smooth reveal animations on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Select all sections to animate
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
});

// Render Projects Dynamically
const projectsGrid = document.getElementById('projects-grid');

if (projectsGrid && typeof projects !== 'undefined') {
    projects.forEach(project => {
        // Create project card element
        const card = document.createElement('article');
        card.className = 'project-card';
        
        // Build tech stack list
        const techList = project.techStack.map(tech => `<li>${tech}</li>`).join('');
        
        card.innerHTML = `
            <div class="project-content">
                <div class="project-header">
                    <i class="far ${project.icon} folder-icon" style="font-size: 2rem;"></i>
                    <div class="project-links">
                        <a href="${project.githubUrl}" target="_blank" aria-label="GitHub Link"><i class="fab fa-github"></i></a>
                        ${project.liveUrl && project.liveUrl !== '#' ? `<a href="${project.liveUrl}" target="_blank" aria-label="Live Demo" style="margin-left: 10px;"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                </div>
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <ul class="project-tech">
                    ${techList}
                </ul>
            </div>
        `;
        
        projectsGrid.appendChild(card);
    });
}

