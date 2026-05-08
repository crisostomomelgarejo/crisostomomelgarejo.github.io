// Theme and Language Toggle Functionality
const themeToggleBtn = document.getElementById('theme-toggle');
const langToggleBtn = document.getElementById('lang-toggle');
const htmlElement = document.documentElement;
const themeIcon = themeToggleBtn.querySelector('i');

// Current Language State
let currentLang = localStorage.getItem('lang') || 'es';

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

// Language Functionality
function applyTranslations(lang) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
    langToggleBtn.textContent = lang === 'es' ? '🇺🇸' : '🇻🇪';
    htmlElement.lang = lang;
    renderProjects(); // Re-render projects in the new language
}

langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', currentLang);
    applyTranslations(currentLang);
});

// Initial translation apply
applyTranslations(currentLang);

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

function renderProjects() {
    if (!projectsGrid || typeof projectsData === 'undefined') return;
    
    projectsGrid.innerHTML = ''; // Clear existing projects

    projectsData.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        
        const techList = project.techStack.map(tech => `<li>${tech}</li>`).join('');
        const title = project.title[currentLang];
        const desc = project.description[currentLang];
        
        card.innerHTML = `
            <div class="project-content">
                <div class="project-header">
                    <i class="fas ${project.icon} folder-icon" style="font-size: 2rem;"></i>
                    <div class="project-links">
                        <a href="${project.githubUrl}" target="_blank" aria-label="GitHub Link"><i class="fab fa-github"></i></a>
                        ${project.liveUrl && project.liveUrl !== '#' ? `<a href="${project.liveUrl}" target="_blank" aria-label="Live Demo" style="margin-left: 10px;"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    </div>
                </div>
                <h3 class="project-title">${title}</h3>
                <p class="project-desc">${desc}</p>
                <ul class="project-tech">
                    ${techList}
                </ul>
            </div>
        `;
        
        projectsGrid.appendChild(card);
    });
}

