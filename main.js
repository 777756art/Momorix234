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
            const previewSrc = row.getAttribute('data-preview');
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
   
import heroImg1 from './hero-img-1.jpg';
import heroImg2 from './hero-img-2.jpg';
import heroImg3 from './hero-img-3.jpg';
import heroImg4 from './hero-img-4.jpg';
import heroImg5 from './hero-img-5.jpg';

import heroBg1 from './hero-bg-1.jpg';
import heroBg2 from './hero-bg-2.jpg';
import heroBg3 from './hero-bg-3.jpg';
import heroBg4 from './hero-bg-4.jpg';
import heroBg5 from './hero-bg-5.jpg';

const heroSlides = [
  {
    photoImage: heroImg1, bgImage: heroBg1,
    label: "Portrait",
    alt: "Portrait photo in frame"
  },
  {
    photoImage: heroImg2, bgImage: heroBg2,
    label: "Wedding",
    alt: "Wedding photo in frame"
  },
  {
    photoImage: heroImg3, bgImage: heroBg3,
    label: "Family",
    alt: "Family photo in frame"
  },
  {
    photoImage: heroImg4, bgImage: heroBg4,
    label: "Couple",
    alt: "Couple photo in frame"
  },
  {
    photoImage: heroImg5, bgImage: heroBg5,
    label: "Memories",
    alt: "Beautiful memory in frame"
  }
];

const heroBgContainer = document.getElementById('hero-bg-container');
const mobilePhotoContainer = document.getElementById('mobile-photo-container');
const mobileThumbnailsContainer = document.getElementById('mobile-thumbnails');

let currentSlideIndex = 0;
let slideInterval;
const SLIDE_DURATION = 5000;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (heroBgContainer) {
    
    // 1. Initialize DOM from Data Array
    heroSlides.forEach((slide, index) => {
        // Create Full Background Image (Desktop)
        const img = document.createElement('img');
        img.src = slide.bgImage; 
        img.alt = slide.alt;
        img.className = 'hero-bg-image';
        if (index === 0) img.classList.add('active');
        heroBgContainer.appendChild(img);
        
        // Create Mobile Inner Image
        if (mobilePhotoContainer) {
            const mImg = document.createElement('img');
            mImg.src = slide.photoImage; // Use raw photo for inner frame
            mImg.alt = slide.alt;
            if (index === 0) mImg.classList.add('active');
            // Insert before glass reflection
            const reflection = mobilePhotoContainer.querySelector('.glass-reflection');
            mobilePhotoContainer.insertBefore(mImg, reflection);
        }
        
        // Create Mobile Thumbnail
        if (mobileThumbnailsContainer) {
            const mBtn = document.createElement('button');
            mBtn.className = 'mobile-thumb-btn';
            if (index === 0) mBtn.classList.add('active');
            
            const mThumbImg = document.createElement('img');
            mThumbImg.src = slide.photoImage;
            mThumbImg.alt = slide.label + ' Preview';
            mBtn.appendChild(mThumbImg);
            
            mBtn.addEventListener('click', () => {
                goToSlide(index);
                resetAutoplay();
            });
            
            mobileThumbnailsContainer.appendChild(mBtn);
        }
    });
    
    const photos = document.querySelectorAll('.hero-bg-image');
    let mPhotos = [];
    if (mobilePhotoContainer) {
        mPhotos = Array.from(mobilePhotoContainer.querySelectorAll('img'));
    }
    const mButtons = document.querySelectorAll('.mobile-thumb-btn');
    
    // 2. Navigation & Transition Logic
    function goToSlide(index) {
        if (index === currentSlideIndex) return;
        
        const prevIndex = currentSlideIndex;
        currentSlideIndex = index;
        
        // Transition Desktop Photos
        if (photos.length > 0) {
            photos[prevIndex].classList.remove('active');
            photos[currentSlideIndex].classList.add('active');
        }
        
        // Transition Mobile Photos
        if (mPhotos.length > 0) {
            mPhotos[prevIndex].classList.remove('active');
            mPhotos[currentSlideIndex].classList.add('active');
        }
        
        // Update Mobile Thumbnails
        if (mButtons.length > 0) {
            mButtons[prevIndex].classList.remove('active');
            mButtons[currentSlideIndex].classList.add('active');
        }
    }
    
    function nextSlide() {
        let nextIndex = (currentSlideIndex + 1) % heroSlides.length;
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
