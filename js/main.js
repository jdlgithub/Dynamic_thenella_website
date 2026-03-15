/**
 * THENELLA - Script principal (dynamisation)
 * Scroll reveal, nav active, slider (dots + pause hover), back-to-top, formulaire (validation visuelle)
 */

(function () {
    'use strict';

    var header = document.getElementById('header');
    var hamburger = document.getElementById('hamburger');
    var navLinks = document.getElementById('nav-links');
    var langEnBtn = document.getElementById('lang-en');
    var langFrBtn = document.getElementById('lang-fr');
    var sliderContainer = document.getElementById('slider-container');
    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');
    var sliderDotsEl = document.getElementById('slider-dots');
    var mediaSliderEl = document.getElementById('media-slider');
    var bookingForm = document.getElementById('booking-form');
    var backToTopBtn = document.getElementById('back-to-top');

    var currentLang = 'en';
    var currentSlide = 0;
    var slideInterval;
    var slideIntervalPaused = false;

    function initScrollHeader() {
        if (!header) return;
        window.addEventListener('scroll', function () {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    function initScrollReveal() {
        var reveals = document.querySelectorAll('.reveal');
        if (!reveals.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

        reveals.forEach(function (el) {
            observer.observe(el);
        });
    }

    function initActiveNav() {
        var sections = document.querySelectorAll('section[id]');
        var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

        function updateActive() {
            var scrollY = window.scrollY;
            var headerHeight = header ? header.offsetHeight : 80;
            var current = null;

            sections.forEach(function (section) {
                var id = section.getAttribute('id');
                if (!id || id === '') return;
                var top = section.offsetTop - headerHeight;
                var height = section.offsetHeight;
                if (scrollY >= top && scrollY < top + height) {
                    current = id;
                }
            });

            navAnchors.forEach(function (a) {
                var href = a.getAttribute('href');
                if (href === '#') return;
                var id = href.slice(1);
                if (id === current) {
                    a.classList.add('active');
                } else {
                    a.classList.remove('active');
                }
            });
        }

        window.addEventListener('scroll', function () {
            requestAnimationFrame(updateActive);
        });
        updateActive();
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
        var slides = document.querySelectorAll('.slide');
        var totalSlides = slides.length;
        if (totalSlides === 0) return;

        function updateSlider() {
            sliderContainer.style.transform = 'translateX(-' + currentSlide * 100 + '%)';
        }

        function updateDots() {
            if (!sliderDotsEl) return;
            var dots = sliderDotsEl.querySelectorAll('.slider-dot');
            dots.forEach(function (dot, i) {
                if (i === currentSlide) {
                    dot.classList.add('active');
                    dot.setAttribute('aria-current', 'true');
                } else {
                    dot.classList.remove('active');
                    dot.removeAttribute('aria-current');
                }
            });
        }

        if (sliderDotsEl) {
            for (var i = 0; i < totalSlides; i++) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Slide ' + (i + 1));
                if (i === 0) dot.setAttribute('aria-current', 'true');
                (function (index) {
                    dot.addEventListener('click', function () {
                        currentSlide = index;
                        updateSlider();
                        updateDots();
                        resetSlideInterval();
                    });
                })(i);
                sliderDotsEl.appendChild(dot);
            }
        }

        function resetSlideInterval() {
            clearInterval(slideInterval);
            if (slideIntervalPaused) return;
            slideInterval = setInterval(function () {
                currentSlide = (currentSlide + 1) % totalSlides;
                updateSlider();
                updateDots();
            }, 5000);
        }

        nextBtn.addEventListener('click', function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
            updateDots();
            resetSlideInterval();
        });
        prevBtn.addEventListener('click', function () {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
            updateDots();
            resetSlideInterval();
        });

        if (mediaSliderEl) {
            mediaSliderEl.addEventListener('mouseenter', function () {
                slideIntervalPaused = true;
                clearInterval(slideInterval);
            });
            mediaSliderEl.addEventListener('mouseleave', function () {
                slideIntervalPaused = false;
                resetSlideInterval();
            });
        }

        slideInterval = setInterval(function () {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
            updateDots();
        }, 5000);
        updateDots();
    }

    function initBackToTop() {
        if (!backToTopBtn) return;
        var scrollThreshold = 400;

        function toggleVisibility() {
            if (window.scrollY > scrollThreshold) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        window.addEventListener('scroll', function () {
            requestAnimationFrame(toggleVisibility);
        });
        toggleVisibility();

        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
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

    function validateEmail(value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value || '');
    }

    function setFieldValidity(input, valid, message) {
        var group = input.closest('.form-group');
        if (!group) return;
        input.classList.remove('valid', 'invalid');
        if (valid === true) {
            input.classList.add('valid');
        } else if (valid === false) {
            input.classList.add('invalid');
        }
        var errorEl = group.querySelector('.field-error');
        if (errorEl) {
            errorEl.textContent = message || '';
        }
    }

    function initFormValidation() {
        if (!bookingForm) return;

        var nameInput = document.getElementById('name');
        var emailInput = document.getElementById('email');

        function validateName() {
            var v = nameInput.value.trim();
            if (v.length === 0) {
                setFieldValidity(nameInput, null, '');
                return false;
            }
            if (v.length < 2) {
                setFieldValidity(nameInput, false, currentLang === 'en' ? 'Name must be at least 2 characters' : 'Le nom doit contenir au moins 2 caractères');
                return false;
            }
            setFieldValidity(nameInput, true, '');
            return true;
        }

        function validateEmailField() {
            var v = emailInput.value.trim();
            if (v.length === 0) {
                setFieldValidity(emailInput, null, '');
                return false;
            }
            if (!validateEmail(v)) {
                setFieldValidity(emailInput, false, currentLang === 'en' ? 'Please enter a valid email' : 'Veuillez entrer un email valide');
                return false;
            }
            setFieldValidity(emailInput, true, '');
            return true;
        }

        if (nameInput) {
            nameInput.addEventListener('blur', validateName);
            nameInput.addEventListener('input', function () {
                if (nameInput.classList.contains('invalid')) validateName();
            });
        }
        if (emailInput) {
            emailInput.addEventListener('blur', validateEmailField);
            emailInput.addEventListener('input', function () {
                if (emailInput.classList.contains('invalid')) validateEmailField();
            });
        }

        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nameValid = nameInput ? validateName() : true;
            var emailValid = emailInput ? validateEmailField() : true;
            if (!nameValid || !emailValid) return;

            var name = nameInput ? nameInput.value : '';
            var email = emailInput ? emailInput.value : '';
            var eventTypeEl = document.getElementById('event-type');
            var eventType = eventTypeEl ? eventTypeEl.value : '';
            var msg = currentLang === 'en'
                ? 'Thank you ' + name + '! Your booking request for a ' + eventType + ' has been received. We\'ll contact you at ' + email + ' shortly.'
                : 'Merci ' + name + '! Votre demande de réservation pour un ' + eventType + ' a été reçue. Nous vous contacterons à ' + email + ' sous peu.';
            alert(msg);
            bookingForm.reset();
            setFieldValidity(nameInput, null, '');
            setFieldValidity(emailInput, null, '');
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
                        top: targetElement.offsetTop - (header ? header.offsetHeight : 80),
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    function init() {
        initScrollHeader();
        initScrollReveal();
        initActiveNav();
        initMobileNav();
        initSlider();
        initBackToTop();
        initLanguage();
        initFormValidation();
        initSmoothScroll();
        switchLanguage('en');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
