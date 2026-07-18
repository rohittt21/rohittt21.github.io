/* ═══════════════════════════════════════════════════════════════
   ROHIT LOHARKAR — Portfolio Interactive Engine
   Particle Network · Magnetic Cursor · Scroll Engine · 3D Tilt
   ═══════════════════════════════════════════════════════════════ */

(function () {
    'use strict';

    // ── Utility: Detect mobile ──
    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent) || window.innerWidth <= 768;

    // ════════════════════════════════════════
    // 1. LOADING SCREEN
    // ════════════════════════════════════════
    const loader = document.getElementById('loader');

    function hideLoader() {
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }
    }

    window.addEventListener('load', () => {
        setTimeout(hideLoader, 1200);
    });

    // Failsafe: hide loader after 4 seconds no matter what
    setTimeout(hideLoader, 4000);

    // ════════════════════════════════════════
    // 2. CUSTOM CURSOR SYSTEM
    // ════════════════════════════════════════
    if (!isMobile) {
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        const glow = document.getElementById('cursor-glow');

        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;
        let glowX = 0, glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Dot follows instantly
            if (dot) {
                dot.style.left = mouseX + 'px';
                dot.style.top = mouseY + 'px';
            }
        });

        // Smooth ring follow
        function animateCursor() {
            const ringEase = 0.15;
            const glowEase = 0.08;

            ringX += (mouseX - ringX) * ringEase;
            ringY += (mouseY - ringY) * ringEase;
            glowX += (mouseX - glowX) * glowEase;
            glowY += (mouseY - glowY) * glowEase;

            if (ring) {
                ring.style.left = ringX + 'px';
                ring.style.top = ringY + 'px';
            }

            if (glow) {
                glow.style.left = glowX + 'px';
                glow.style.top = glowY + 'px';
            }

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .skill-card, .project-card, .timeline-card, .contact-method, .highlight-card, .skill-tag, .form-input, .form-textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (ring) ring.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                if (ring) ring.classList.remove('hover');
            });
        });
    }

    // ════════════════════════════════════════
    // 3. PARTICLE NEURAL NETWORK CANVAS
    // ════════════════════════════════════════
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let canvasW, canvasH;
        let animMouseX = -1000, animMouseY = -1000;

        const PARTICLE_COUNT = isMobile ? 30 : 70;
        const CONNECTION_DISTANCE = isMobile ? 100 : 160;
        const MOUSE_RADIUS = 180;

        function resizeCanvas() {
            canvasW = canvas.width = window.innerWidth;
            canvasH = canvas.height = window.innerHeight;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvasW;
                this.y = Math.random() * canvasH;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 0.5;
                this.baseAlpha = Math.random() * 0.4 + 0.1;
                this.alpha = this.baseAlpha;

                const colors = [
                    '123, 47, 242',   // electric violet
                    '0, 212, 255',    // aurora cyan
                    '255, 0, 110',    // nebula pink
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Mouse repulsion
                const dx = this.x - animMouseX;
                const dy = this.y - animMouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < MOUSE_RADIUS) {
                    const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                    this.alpha = Math.min(1, this.baseAlpha + force * 0.5);
                } else {
                    this.alpha += (this.baseAlpha - this.alpha) * 0.05;
                }

                // Wrap around edges
                if (this.x < -10) this.x = canvasW + 10;
                if (this.x > canvasW + 10) this.x = -10;
                if (this.y < -10) this.y = canvasH + 10;
                if (this.y > canvasH + 10) this.y = -10;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(new Particle());
            }
        }

        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONNECTION_DISTANCE) {
                        const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(123, 47, 242, ${alpha})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvasW, canvasH);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            drawConnections();
            requestAnimationFrame(animateParticles);
        }

        resizeCanvas();
        initParticles();
        animateParticles();

        window.addEventListener('resize', () => {
            resizeCanvas();
        });

        document.addEventListener('mousemove', (e) => {
            animMouseX = e.clientX;
            animMouseY = e.clientY;
        });
    }

    // ════════════════════════════════════════
    // 4. SCROLL PROGRESS BAR
    // ════════════════════════════════════════
    const scrollProgress = document.getElementById('scroll-progress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;

        if (scrollProgress) {
            scrollProgress.style.transform = `scaleX(${progress})`;
        }
    }

    // ════════════════════════════════════════
    // 5. NAVIGATION HUD
    // ════════════════════════════════════════
    const navHud = document.getElementById('nav-hud');
    const navLinks = document.querySelectorAll('.nav-link');
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.getElementById('nav-links');
    const sections = document.querySelectorAll('.section[id]');
    let lastScrollY = 0;

    // Show/hide nav based on scroll
    function updateNav() {
        const scrollY = window.scrollY;

        if (navHud) {
            if (scrollY > 100) {
                navHud.classList.add('visible');
            } else {
                navHud.classList.remove('visible');
            }
        }

        lastScrollY = scrollY;
    }

    // Active section tracking
    function updateActiveSection() {
        let current = '';
        const scrollY = window.scrollY + window.innerHeight / 3;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === current) {
                link.classList.add('active');
            }
        });
    }

    // Mobile nav toggle
    if (navToggle && navLinksContainer) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navLinksContainer.classList.toggle('open');
        });

        // Close on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navLinksContainer.classList.remove('open');
            });
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ════════════════════════════════════════
    // 6. SCROLL REVEAL ENGINE
    // ════════════════════════════════════════
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ════════════════════════════════════════
    // 7. TYPING / ROLE ROTATION
    // ════════════════════════════════════════
    const roleTextEl = document.getElementById('role-text');
    const roles = [
        'AI Engineer',
        'Software Engineer',
        'Agentic AI Developer',
        'Data Scientist',
        'MLOps Engineer',
        'LLM Application Builder'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingTimeout;

    function typeRole() {
        if (!roleTextEl) return;

        const currentRole = roles[roleIndex];

        if (isDeleting) {
            roleTextEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            roleTextEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 500;
        }

        typingTimeout = setTimeout(typeRole, delay);
    }

    // Start typing after loader
    setTimeout(typeRole, 1800);

    // ════════════════════════════════════════
    // 8. ANIMATED COUNTERS
    // ════════════════════════════════════════
    const statValues = document.querySelectorAll('.stat-value');

    function animateCounter(el) {
        const target = parseFloat(el.dataset.count);
        const isDecimal = target % 1 !== 0;
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;

            if (isDecimal) {
                el.textContent = current.toFixed(2);
            } else {
                el.textContent = Math.floor(current) + '+';
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statValues.forEach(el => counterObserver.observe(el));

    // ════════════════════════════════════════
    // 9. 3D CARD TILT EFFECT
    // ════════════════════════════════════════
    if (!isMobile) {
        const tiltCards = document.querySelectorAll('[data-tilt]');

        tiltCards.forEach(card => {
            const lightEl = card.querySelector('.tilt-light');

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;

                // Move light reflection
                if (lightEl) {
                    lightEl.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255, 255, 255, 0.08), transparent 60%)`;
                }
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

                setTimeout(() => {
                    card.style.transition = '';
                }, 500);

                if (lightEl) {
                    lightEl.style.background = '';
                }
            });

            card.addEventListener('mouseenter', () => {
                card.style.transition = 'none';
            });
        });
    }

    // ════════════════════════════════════════
    // 10. UNIFIED SCROLL HANDLER
    // ════════════════════════════════════════
    let ticking = false;

    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateScrollProgress();
                updateNav();
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial calls
    updateScrollProgress();
    updateNav();

    // ════════════════════════════════════════
    // 11. CONSOLE BRANDING
    // ════════════════════════════════════════
    console.log(
        '%c🚀 Portfolio Engine Loaded',
        'color: #7B2FF2; font-size: 18px; font-weight: bold; text-shadow: 0 0 10px rgba(123,47,242,0.5);'
    );
    console.log(
        '%cDesigned & Built by Rohit Loharkar',
        'color: #00D4FF; font-size: 12px;'
    );

})();