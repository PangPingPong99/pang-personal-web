document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. DARK / LIGHT MODE TOGGLE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    if (themeToggleBtn) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);

        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (themeIcon) {
            themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    /* ==========================================================================
       2. MOBILE NAVBAR TOGGLE (HAMBURGER MENU)
       ========================================================================== */
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       3. SCROLL REVEAL ANIMATIONS (Intersection Observer API)
       ========================================================================== */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elementsToReveal = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale, .reveal-slide-up');
    elementsToReveal.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       4. DYNAMIC FOOTER YEAR
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       5. AUDIO PLAY / PAUSE (LAGU FAVORIT)
       ========================================================================== */
    window.togglePlay = function(button) {
        const card = button ? button.closest('.card') : null;
        const audio = card ? card.querySelector('.song-audio') : null;
        const icon = button ? button.querySelector('i') : null;

        if (!audio) return;

        document.querySelectorAll('.song-audio').forEach(otherAudio => {
            if (otherAudio !== audio) {
                otherAudio.pause();
                otherAudio.currentTime = 0; 
                
                const otherBtnIcon = otherAudio.closest('.card').querySelector('.play-btn i');
                if (otherBtnIcon) {
                    otherBtnIcon.className = 'fas fa-play';
                }
            }
        });

        if (audio.paused) {
            audio.play();
            if (icon) icon.className = 'fas fa-pause';
        } else {
            audio.pause();
            if (icon) icon.className = 'fas fa-play';
        }

        audio.onended = () => {
            if (icon) icon.className = 'fas fa-play';
        };
    };

    /* ==========================================================================
       6. DIGITAL ESCAPE FILTERING
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const popGroups = document.querySelectorAll('.pop-group');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                popGroups.forEach(group => {
                    const category = group.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        group.classList.remove('hide');
                        group.classList.add('active'); 
                    } else {
                        group.classList.add('hide');
                    }
                });
            });
        });
    }

    /* ==========================================================================
       7. LIGHTBOX MODAL (ZOOM FOTO GALERI)
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (lightbox && galleryItems.length > 0) {
        galleryItems.forEach(item => {
            const img = item.querySelector('.img-frame img');
            const caption = item.querySelector('.gallery-caption');

            if (img) {
                img.addEventListener('click', () => {
                    if (lightboxImg) lightboxImg.src = img.src;
                    if (lightboxCaption) lightboxCaption.textContent = caption ? caption.textContent : '';
                    lightbox.classList.add('active');
                });
            }
        });

        if (lightboxClose) {
            lightboxClose.addEventListener('click', () => {
                lightbox.classList.remove('active');
            });
        }

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target === lightboxClose) {
                lightbox.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                lightbox.classList.remove('active');
            }
        });
    }

    /* ==========================================================================
       8. AUTO TYPING EFFECT (HERO SECTION)
       ========================================================================== */
    const typingTextElement = document.querySelector('.typing-text');
    const phrases = [
        "TECH ENTHUSIAST",
        "ANIME MARATHONER",
        "MOVIE GEEK",
        "MUSIC VIBER",
        "MANGA READER"
    ];

    if (typingTextElement) {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50; 
            } else {
                typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100; 
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2000; 
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length; 
                typingSpeed = 500; 
            }

            setTimeout(typeEffect, typingSpeed);
        }

        typeEffect();
    }

    /* ==========================================================================
       9. GAME HERO & COMMANDER STATS MODAL
       ========================================================================== */
    const gameModal = document.getElementById('game-modal');
    const gmImg = document.getElementById('gm-img');
    const gmName = document.getElementById('gm-name');
    const gmRole = document.getElementById('gm-role');
    const gmMatches = document.getElementById('gm-matches');
    const gmWr = document.getElementById('gm-wr');
    const gmClose = document.querySelector('.game-modal-close');
    const heroCards = document.querySelectorAll('.hero-card');

    if (gameModal && heroCards.length > 0) {
        heroCards.forEach(card => {
            card.addEventListener('click', () => {
                const name = card.getAttribute('data-name') || (card.querySelector('h4') ? card.querySelector('h4').textContent : 'Hero');
                const role = card.getAttribute('data-role') || 'Hero / Commander';
                const avatarImg = card.querySelector('.hero-avatar img');
                const poster = card.getAttribute('data-poster') || (avatarImg ? avatarImg.src : '');
                const matches = card.getAttribute('data-matches') || '0 Match';
                const wr = card.getAttribute('data-wr') || '0%';

                if (gmName) gmName.textContent = name;
                if (gmRole) gmRole.textContent = role;
                if (gmImg) gmImg.src = poster;
                if (gmMatches) gmMatches.textContent = matches;
                if (gmWr) gmWr.textContent = wr;

                gameModal.classList.add('active');
            });
        });

        if (gmClose) {
            gmClose.addEventListener('click', () => {
                gameModal.classList.remove('active');
            });
        }

        gameModal.addEventListener('click', (e) => {
            if (e.target === gameModal || e.target === gmClose) {
                gameModal.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && gameModal.classList.contains('active')) {
                gameModal.classList.remove('active');
            }
        });
    }

    /* ==========================================================================
       10. MINECRAFT 3D SKIN VIEWER (SAFE GUARD)
       ========================================================================== */
    const skinCanvas = document.getElementById('minecraft-skin-canvas');

    if (skinCanvas && typeof skinview3d !== 'undefined') {
        try {
            const skinViewer = new skinview3d.SkinViewer({
                canvas: skinCanvas,
                width: 200,
                height: 250,
                skin: "https://files.catbox.moe/y8aksh.png"
            });

            const control = skinview3d.createOrbitControls(skinViewer);
            control.enableRotate = true;
            control.enableZoom = false; 

            skinViewer.animation = new skinview3d.WalkingAnimation();
            skinViewer.animation.speed = 0.5;
        } catch (e) {
            console.log("3D Skin Viewer Error Handled:", e);
        }
    }

    /* ==========================================================================
       11. GAMING ZONE FILTERING
       ========================================================================== */
    const gameFilterBtns = document.querySelectorAll('.game-filter-btn');
    const gameGroups = document.querySelectorAll('.game-group');

    if (gameFilterBtns.length > 0) {
        gameFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                gameFilterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-game-filter');

                gameGroups.forEach(group => {
                    const gameType = group.getAttribute('data-game');

                    if (filterValue === 'all' || gameType === filterValue) {
                        group.classList.remove('hide-game');
                        group.classList.add('active');
                    } else {
                        group.classList.add('hide-game');
                    }
                });
            });
        });
    }
/* ==========================================================================
       12. 3D TILT EFFECT ON ALL CARDS (SELURUH WEBSITE)
       ========================================================================== */
    if (typeof VanillaTilt !== 'undefined') {
        // Mengambil SEMUA kartu di seluruh seksi (Biodata, Hobi, Galeri, Tools, Desain, Pop Culture, Gaming)
        const allCards = document.querySelectorAll('.card, .biodata-card, .gallery-item');
        
        VanillaTilt.init(allCards, {
            max: 15,               // Derajat kemiringan 3D
            speed: 400,            // Kecepatan respon miring
            glare: true,           // Efek pantulan kilau cahaya
            "max-glare": 0.35,     // Tingkat terang kilauan
            scale: 1.03,           // Efek sedikit membesar saat di-hover
            perspective: 1000,     // Kedalaman perspektif 3D
            gyroscope: true        // Mendukung kemiringan di layar HP
        });
    }

/* ==========================================================================
       13. FULLSITE PARTICLES BACKGROUND (PARTICLES.JS)
       ========================================================================== */
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 70, // Jumlah partikel di seluruh layar
                    "density": {
                        "enable": true,
                        "value_area": 900
                    }
                },
                "color": {
                    "value": "#4ade80" // Warna Hijau Mint
                },
                "shape": {
                    "type": "circle"
                },
                "opacity": {
                    "value": 0.4,
                    "random": false
                },
                "size": {
                    "value": 3,
                    "random": true
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#4ade80", // Warna Garis Penghubung Mint
                    "opacity": 0.25,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1.6, // Kecepatan melayang santai
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "detect_on": "window", // Deteksi gerakan mouse di seluruh jendela web
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab" // Garis partikel terhubung ke kursor
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 180,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "push": {
                        "particles_nb": 3
                    }
                }
            },
            "retina_detect": true
        });
    }
    
    /* ==========================================================================
       14. GRAPHIC DESIGN PORTFOLIO LIGHTBOX & 3D TILT
       ========================================================================== */
    const desainCards = document.querySelectorAll('.desain-card');
    const desainLightbox = document.getElementById('desain-lightbox');
    const desainLightboxImg = document.getElementById('desain-lightbox-img');
    const desainLightboxCaption = document.getElementById('desain-lightbox-caption');
    const desainLightboxClose = document.querySelector('.desain-lightbox-close');

    if (desainLightbox && desainCards.length > 0) {
        desainCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img');
                const title = card.querySelector('h4');

                if (img && desainLightboxImg) {
                    desainLightboxImg.src = img.src;
                    if (desainLightboxCaption) {
                        desainLightboxCaption.textContent = title ? title.textContent : '';
                    }
                    desainLightbox.classList.add('active');
                }
            });
        });

        // Tutup Modal saat klik tombol X
        if (desainLightboxClose) {
            desainLightboxClose.addEventListener('click', () => {
                desainLightbox.classList.remove('active');
            });
        }

        // Tutup Modal saat klik area hitam di luar gambar
        desainLightbox.addEventListener('click', (e) => {
            if (e.target === desainLightbox || e.target === desainLightboxClose) {
                desainLightbox.classList.remove('active');
            }
        });

        // Tutup Modal saat tekan tombol ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && desainLightbox.classList.contains('active')) {
                desainLightbox.classList.remove('active');
            }
        });
    }

    // Mengaktifkan efek 3D Tilt khusus untuk Desain Cards jika VanillaTilt tersedia
    if (typeof VanillaTilt !== 'undefined' && desainCards.length > 0) {
        VanillaTilt.init(desainCards, {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.35,
            scale: 1.03
        });
    }
});