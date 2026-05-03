document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconMenu = document.getElementById('icon-menu');
    const iconClose = document.getElementById('icon-close');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isMenuOpen = mobileMenu.classList.contains('active');
            
            if (isMenuOpen) {
                // Close menu
                mobileMenu.classList.remove('active');
                iconMenu.style.display = 'block';
                iconClose.style.display = 'none';
            } else {
                // Open menu
                mobileMenu.classList.add('active');
                iconMenu.style.display = 'none';
                iconClose.style.display = 'block';
            }
        });

        // Close mobile menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                iconMenu.style.display = 'block';
                iconClose.style.display = 'none';
            });
        });
    }

    // Navbar Scroll Effect (Optional depending on design, but good for fixed navs)
    const navbar = document.getElementById('navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            } else {
                navbar.style.boxShadow = 'none';
            }
        });
    }
    // Scroll Animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-up');
    animatedElements.forEach(el => observer.observe(el));

    // Dynamic Tab Title
    let originalTitle = document.title;
    window.addEventListener('blur', () => {
        document.title = "Don't stop executing 🚀";
    });
    window.addEventListener('focus', () => {
        document.title = originalTitle;
    });
});
