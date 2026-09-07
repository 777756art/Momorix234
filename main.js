// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            e.preventDefault();
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
            window.scrollTo({
                 top: offsetPosition,
                 behavior: "smooth"
            });
        }
    });
});

// Mobile Menu Logic
const menuBtn = document.querySelector('.mobile-menu-btn');
const closeMenuBtn = document.getElementById('menu-close-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (menuBtn && closeMenuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent background scrolling
    });
    
    closeMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close when clicking a link
    mobileMenu.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Price List - Desktop Hover Preview Logic
const priceRows = document.querySelectorAll('.price-row');
const desktopPreviewImg = document.getElementById('desktop-frame-preview');

if (priceRows.length > 0 && desktopPreviewImg) {
    priceRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            const previewSrc = row.querySelector(".row-thumb").src;
            if (previewSrc) {
                desktopPreviewImg.style.opacity = '0';
                setTimeout(() => {
                    desktopPreviewImg.src = previewSrc;
                    desktopPreviewImg.style.opacity = '1';
                }, 150);
            }
        });
    });
}

/* ==================================================
   CINEMATIC HERO SLIDER LOGIC
   ================================================== */
   
// Hero Slider - transitions the static images already in HTML
const heroBgContainer = document.getElementById('hero-bg-container');
let currentSlideIndex = 0;
let slideInterval;
const SLIDE_DURATION = 5000;

if (heroBgContainer) {
    // 1. Use static images already in HTML
    const photos = document.querySelectorAll('.hero-bg-image');
    const totalSlides = photos.length;

    // 2. Navigation & Transition Logic
    function goToSlide(index) {
        if (index === currentSlideIndex) return;
        const prevIndex = currentSlideIndex;
        currentSlideIndex = index;

        // Remove active + restart Ken Burns by cloning
        photos[prevIndex].classList.remove('active');
        // Force animation restart on new active slide
        const next = photos[currentSlideIndex];
        next.style.animation = 'none';
        next.offsetHeight; // trigger reflow
        next.style.animation = '';
        next.classList.add('active');
    }

    function nextSlide() {
        let nextIndex = (currentSlideIndex + 1) % totalSlides;
        goToSlide(nextIndex);
    }

    // 3. Autoplay Management
    function startAutoplay() {
        slideInterval = setInterval(nextSlide, SLIDE_DURATION);
    }
    
    function stopAutoplay() {
        clearInterval(slideInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // Touch Interaction Pausing
    if (mobilePhotoContainer && mobileThumbnailsContainer) {
        const pauseEvents = ['touchstart', 'mousedown'];
        const resumeEvents = ['touchend', 'mouseup', 'mouseleave'];
        
        pauseEvents.forEach(evt => {
            mobilePhotoContainer.addEventListener(evt, stopAutoplay);
            mobileThumbnailsContainer.addEventListener(evt, stopAutoplay);
        });
        
        resumeEvents.forEach(evt => {
            mobilePhotoContainer.addEventListener(evt, resetAutoplay);
            mobileThumbnailsContainer.addEventListener(evt, resetAutoplay);
        });
    }
    
    // Start initial loop
    startAutoplay();
}

// Scroll Reveal Animations
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-stagger');
    
    // Add is-visible to hero elements immediately if they don't use the keyframe anim
    // But we are using .hero-load-anim for them.
    
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
