/**
 * THENELLA - Script principal (dynamisation)
 * Gestion : header au scroll, menu mobile, slider galerie, multilingue, formulaire, ancres
 */

(function () {
    'use strict';

    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const langEnBtn = document.getElementById('lang-en');
    const langFrBtn = document.getElementById('lang-fr');
    const sliderContainer = document.getElementById('slider-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const bookingForm = document.getElementById('booking-form');

    let currentLang = 'en';
    let currentSlide = 0;
    let slideInterval;

    function initScrollHeader() {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    function initMobileNav() {
        if (!hamburger || !navLinks) return;
        hamburger.addEventListener('click', function () {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active')
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        });
        document.querySelectorAll('.nav-links a').forEach(function (link) {
            link.addEventListener('click', function () {
                navLinks.classList.remove('active');
                hamburger.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }

    function initSlider() {
        if (!sliderContainer || !prevBtn || !nextBtn) return;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;
        if (totalSlides === 0) return;

        function updateSlider() {
            sliderContainer.style.transform = 'translateX(-' + currentSlide * 100 + '%)';
        }

        nextBtn.addEventListener('click', function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
            resetSlideInterval();
        });
        prevBtn.addEventListener('click', function () {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
            resetSlideInterval();
        });

        function resetSlideInterval() {
            clearInterval(slideInterval);
            slideInterval = setInterval(function () {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
            }, 5000);
        }

        slideInterval = setInterval(function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }, 5000);
    }

    function switchLanguage(lang) {
        currentLang = lang;
        if (langEnBtn && langFrBtn) {
            if (lang === 'en') {
                langEnBtn.classList.add('active');
                langFrBtn.classList.remove('active');
            } else {
                langFrBtn.classList.add('active');
                langEnBtn.classList.remove('active');
            }
        }
        document.querySelectorAll('[data-lang-en]').forEach(function (element) {
            var attrEn = element.getAttribute('data-lang-en');
            var attrFr = element.getAttribute('data-lang-fr');
            if (!attrEn || !attrFr) return;
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.value = lang === 'en' ? attrEn : attrFr;
            } else {
                element.textContent = lang === 'en' ? attrEn : attrFr;
            }
        });
        document.querySelectorAll('option[data-lang-en]').forEach(function (option) {
            var attrEn = option.getAttribute('data-lang-en');
            var attrFr = option.getAttribute('data-lang-fr');
            if (attrEn && attrFr) option.textContent = lang === 'en' ? attrEn : attrFr;
        });
    }

    function initLanguage() {
        if (langEnBtn) langEnBtn.addEventListener('click', function () { switchLanguage('en'); });
        if (langFrBtn) langFrBtn.addEventListener('click', function () { switchLanguage('fr'); });
    }

    function initBookingForm() {
        if (!bookingForm) return;
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('name') && document.getElementById('name').value;
            var email = document.getElementById('email') && document.getElementById('email').value;
            var eventTypeEl = document.getElementById('event-type');
            var eventType = eventTypeEl ? eventTypeEl.value : '';
            var msg = currentLang === 'en'
                ? 'Thank you ' + name + '! Your booking request for a ' + eventType + ' has been received. We\'ll contact you at ' + email + ' shortly.'
                : 'Merci ' + name + '! Votre demande de réservation pour un ' + eventType + ' a été reçue. Nous vous contacterons à ' + email + ' sous peu.';
            alert(msg);
            bookingForm.reset();
            if (eventTypeEl && eventTypeEl.options[0]) {
                eventTypeEl.options[0].textContent = currentLang === 'en' ? 'Select an option' : 'Sélectionnez une option';
            }
        });
    }

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId === '#') return;
                e.preventDefault();
                var targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function init() {
        initScrollHeader();
        initMobileNav();
        initSlider();
        initLanguage();
        initBookingForm();
        initSmoothScroll();
        switchLanguage('en');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
