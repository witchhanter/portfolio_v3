// Переключение темы
const desktopThemeToggle = document.getElementById('desktopThemeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const themeIcons = document.querySelectorAll('.theme-icon');

// Проверяем сохраненную тему
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeIcons(savedTheme);

function updateThemeIcons(theme) {
    themeIcons.forEach(icon => {
        icon.textContent = theme === 'light' ? '🌙' : '☀️';
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
}

desktopThemeToggle.addEventListener('click', toggleTheme);
mobileThemeToggle.addEventListener('click', toggleTheme);

// Гамбургер меню
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Блокируем скролл при открытом меню
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Закрытие меню при клике на ссылку
document.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', () => {
        // Закрываем мобильное меню
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Закрытие меню при клике вне меню
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// Навигация
let isManualScroll = false;

document.querySelectorAll('.header__link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        isManualScroll = true;
        
        // Обновляем все ссылки
        document.querySelectorAll('.header__link').forEach(l => {
            l.classList.remove('active');
        });
        this.classList.add('active');
        
        // Прокручиваем
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            history.pushState(null, null, targetId);
        }
        
        // Сбрасываем флаг
        setTimeout(() => {
            isManualScroll = false;
        }, 1500);
    });
});

// Анимации при скролле - ИСПРАВЛЕННАЯ версия
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('#projects .fade-in, #projects .slide-in, #contacts .fade-in, #contacts .slide-in');
    
    function checkVisibility() {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.85;
        
        animatedElements.forEach(element => {
            if (!element.classList.contains('visible')) {
                const rect = element.getBoundingClientRect();
                
                if (rect.top < triggerPoint) {
                    element.classList.add('visible');
                }
            }
        });
    }
    
    // Проверяем сразу при загрузке
    setTimeout(checkVisibility, 100);
    
    // Проверяем при скролле
    window.addEventListener('scroll', checkVisibility);
}

// Активная секция при скролле
function initScrollSpy() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.header__link');
    
    function updateActiveSection() {
        if (isManualScroll) return;
        
        let currentSection = '';
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
                break;
            }
        }
        
        if (window.scrollY < 100 && !currentSection) {
            currentSection = 'home';
        }
        
        if (!currentSection && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100) {
            currentSection = sections[sections.length - 1].getAttribute('id');
        }
        
        if (currentSection) {
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${currentSection}`;
                link.classList.toggle('active', isActive);
            });
        }
    }
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveSection, 50);
    });
    
    updateActiveSection();
}

// Адаптивный ресайз - автоматически закрываем меню на десктопе
function handleResize() {
    // На десктопе автоматически закрываем меню
    if (window.innerWidth > 768) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initScrollSpy();
    
    // Фоновое изображение
    const bgImage = new Image();
    bgImage.src = 'images/hero-bg.jpg';
    
    // Обработка хэша в URL
    if (window.location.hash) {
        const hash = window.location.hash;
        const targetLink = document.querySelector(`.header__link[href="${hash}"]`);
        
        if (targetLink) {
            isManualScroll = true;
            
            document.querySelectorAll('.header__link').forEach(link => {
                link.classList.remove('active');
            });
            targetLink.classList.add('active');
            
            setTimeout(() => {
                isManualScroll = false;
            }, 1500);
        }
    }
    
    // Ресайз
    window.addEventListener('resize', handleResize);
});