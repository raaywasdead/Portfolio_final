// ==========================================
// PORTFOLIO - JOÃO VITOR BARBOSA
// Versão Otimizada com Performance
// ==========================================

// ==========================================
// INICIALIZAÇÃO
// ==========================================

/**
 * Aguarda o carregamento do GSAP e ScrollTrigger
 * antes de inicializar a aplicação
 */
const initWhenReady = () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(initWhenReady, 50);
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    new AnimationController();
};

// ==========================================
// CONTROLLER PRINCIPAL
// ==========================================

class AnimationController {
    constructor() {
        this.isLoaded = false;
        this.init();
    }

    // ==========================================
    // MÉTODO PRINCIPAL DE INICIALIZAÇÃO
    // ==========================================

    init() {
        this.initLoadingScreen();
        this.detectMobilePerformance();

        window.addEventListener('load', () => {
            setTimeout(() => {
                this.setupInitialStates();
                this.initScrollAnimations();
                this.initHoverEffects();
                this.initNavbar();
                this.initMobileMenu();
                this.initScrollToTop();
                this.initScrollIndicator();
                this.initSmoothScroll();
                this.initLazyImages();
                this.refreshScrollTrigger();
                this.isLoaded = true;
            }, 100);
        });
    }

    // ==========================================
    // LOADING SCREEN
    // ==========================================

    initLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        const loadingBar = document.querySelector('.loading-bar');
        const loadingPercentage = document.querySelector('.loading-percentage');
        
        if (!loadingScreen || !loadingBar || !loadingPercentage) return;

        // Bloqueia scroll durante carregamento
        document.documentElement.classList.add('no-scroll');
        document.body.classList.add('no-scroll');

        // Variáveis de progresso
        let currentProgress = 0;
        let targetProgress = 0;
        let isComplete = false;
        const isMobileDevice = window.innerWidth <= 768;
        const minLoadingTime = isMobileDevice ? 1500 : 2000;
        const startTime = Date.now();

        // Recursos para carregar
        const images = Array.from(document.images);
        const totalResources = isMobileDevice ? images.length : images.length + 2;
        let loadedResources = 0;

        // Atualiza progresso target
        const updateTargetProgress = () => {
            loadedResources++;
            targetProgress = Math.min((loadedResources / totalResources) * 100, 100);

            if (targetProgress >= 100 && !isComplete) {
                isComplete = true;
                completeLoading();
            }
        };

        // Anima barra de progresso
        const animateProgress = () => {
            if (currentProgress < targetProgress) {
                const diff = targetProgress - currentProgress;
                const increment = Math.max(0.5, diff * 0.5);
                currentProgress = Math.min(currentProgress + increment, targetProgress);

                loadingBar.style.width = currentProgress + '%';
                loadingPercentage.textContent = Math.floor(currentProgress) + '%';

                // Completa quando chega em 99%
                if (currentProgress >= 99 && targetProgress >= 99 && !isComplete) {
                    currentProgress = 100;
                    targetProgress = 100;
                    loadingBar.style.width = '100%';
                    loadingPercentage.textContent = '100%';
                    isComplete = true;
                    completeLoading();
                }
            }
            if (!isComplete || currentProgress < 100) {
                requestAnimationFrame(animateProgress);
            }
        };
        animateProgress();

        // Completa loading e remove tela
        const completeLoading = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, minLoadingTime - elapsedTime);

            setTimeout(() => {
                gsap.set('body', { opacity: 0 });
                gsap.to('body', { opacity: 1, duration: 1, ease: 'power2.out' });

                loadingScreen.remove();
                document.documentElement.classList.remove('no-scroll');
                document.body.classList.remove('no-scroll');
            }, remainingTime);
        };

        // Progressos intermediários
        setTimeout(() => { targetProgress = 20; }, 100);
        setTimeout(() => { targetProgress = 40; }, 300);
        setTimeout(() => { targetProgress = 60; }, 600);

        // Monitora carregamento de imagens
        images.forEach(img => {
            if (img.complete) {
                updateTargetProgress();
            } else {
                img.addEventListener('load', updateTargetProgress);
                img.addEventListener('error', updateTargetProgress);
            }
        });

        // Monitora carregamento de fontes
        if (document.fonts) {
            document.fonts.ready.then(updateTargetProgress);
        } else {
            updateTargetProgress();
        }

        window.addEventListener('load', updateTargetProgress);

        // Timeout de segurança (5 segundos)
        setTimeout(() => {
            if (!isComplete) {
                targetProgress = 100;
                currentProgress = 100;
                isComplete = true;
                completeLoading();
            }
        }, 5000);
    }

    // ==========================================
    // OTIMIZAÇÃO DE PERFORMANCE
    // ==========================================

    /**
     * Detecta dispositivos mobile e de baixa performance
     * para aplicar otimizações específicas
     */
    detectMobilePerformance() {
        const isMobile = window.innerWidth <= 768;
        const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;

        if (isMobile || isLowEndDevice) {
            document.body.classList.add('mobile-optimized');
            this.optimizeMobileAnimations();

            // Remove will-change para economizar recursos
            document.querySelectorAll('.service-card, .orb').forEach(el => {
                el.style.willChange = 'auto';
            });
        }
    }

    /**
     * Otimiza animações para dispositivos mobile
     */
    optimizeMobileAnimations() {
        // Configura ScrollTrigger para mobile
        ScrollTrigger.config({
            limitCallbacks: true,
            syncInterval: 300
        });

        // Remove will-change após animações
        const removeWillChange = (elements) => {
            elements.forEach(el => {
                if (el) el.style.willChange = 'auto';
            });
        };

        setTimeout(() => {
            const cards = document.querySelectorAll('.service-card, .contact-main-card, .social-card, .cv-card, .project-card-single');
            removeWillChange(cards);
        }, 3000);
    }

    // ==========================================
    // LAZY LOADING DE IMAGENS
    // ==========================================

    initLazyImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            document.querySelectorAll('img[loading="lazy"]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // ==========================================
    // SETUP ESTADOS INICIAIS
    // ==========================================

    /**
     * Define estados iniciais dos elementos que serão animados
     * (opacity: 0, y: 40) para animação de entrada
     */
    setupInitialStates() {
        const elementsToAnimate = {
            about: [
                '.about .section-label',
                '.about .section-title',
                '.about-description',
                '.courses-section',
                '.skills-section',
                '.cv-download-section'
            ],
            services: [
                '.services .section-label',
                '.services .section-title',
                '.service-card'
            ],
            projects: [
                '.projects .section-label',
                '.projects .section-title',
                '.project-showcase'
            ],
            contact: [
                '.contact-cta .section-label',
                '.contact-cta h2',
                '.contact-description',
                '.contact-main-card',
                '.contact-divider',
                '.social-card'
            ],
            footer: [
                '.footer-brand',
                '.footer-column',
                '.footer-bottom'
            ]
        };

        // Aplica estado inicial para todos os elementos
        Object.values(elementsToAnimate).flat().forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                gsap.set(elements, {
                    opacity: 0,
                    y: 40
                });
            }
        });

        // Estado inicial específico para service cards
        const serviceCards = document.querySelectorAll('.service-card');
        if (serviceCards.length > 0) {
            serviceCards.forEach((card) => {
                gsap.set(card, {
                    opacity: 0,
                    y: 40,
                    force3D: true
                });
            });
        }

        // Desabilita interação com CV card até animação completar
        const cvCard = document.querySelector('.cv-card');
        if (cvCard) cvCard.style.pointerEvents = 'none';
    }

    // ==========================================
    // ANIMAÇÕES DE SCROLL
    // ==========================================

    initScrollAnimations() {
        this.aboutTimeline();
        this.servicesTimeline();
        this.projectsTimeline();
        this.contactTimeline();
    }

    // ------------------------------------------
    // Timeline: Seção SOBRE
    // ------------------------------------------

    aboutTimeline() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".about",
                start: "top 50%",
                once: true
            }
        });

        tl.to(".about .section-label", {
            opacity: 1,
            y: 0,
            duration: 0.7,
            clearProps: "all"
        })
        .to(".about .section-title", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            clearProps: "all"
        }, "-=0.4")
        .to(".about-description", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.2,
            clearProps: "all"
        }, "-=0.4")
        .to(".courses-section", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            clearProps: "all"
        }, "-=0.5")
        .to(".skills-section", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            clearProps: "all"
        }, "-=0.6")
        .to(".cv-download-section", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
            onComplete: () => {
                const cvCard = document.querySelector('.cv-card');
                if (cvCard) cvCard.style.pointerEvents = 'auto';
            }
        }, "-=0.5");
    }

    // ------------------------------------------
    // Timeline: Seção SERVIÇOS
    // ------------------------------------------

    servicesTimeline() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".services",
                start: "top 50%",
                once: true,
                onEnter: () => {
                    const serviceCards = document.querySelectorAll('.service-card');
                    serviceCards.forEach(card => card.style.pointerEvents = 'none');
                }
            }
        });

        tl.to(".services .section-label", {
            opacity: 1,
            y: 0,
            duration: 0.7,
        })
        .to(".services .section-title", {
            opacity: 1,
            y: 0,
            duration: 0.9,
        }, "-=0.4")
        .to(".service-card", {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: {
                each: 0.12,
                onComplete: function () {
                    this.targets().forEach(target => {
                        gsap.set(target, { clearProps: "all" });
                    });
                }
            },
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => {
                    document.querySelectorAll('.service-card').forEach(card => {
                        card.style.opacity = '1';
                        card.style.transform = '';
                        card.style.pointerEvents = 'auto';
                    });
                }, 300);
            }
        }, "-=0.4");
    }

    // ------------------------------------------
    // Timeline: Seção PROJETOS
    // ------------------------------------------

    projectsTimeline() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".projects",
                start: "top 50%",
                once: true,
                onEnter: () => {
                    const projectCard = document.querySelector('.project-card-single');
                    if (projectCard) projectCard.style.pointerEvents = 'none';
                }
            }
        });

        tl.to(".projects .section-label", {
            opacity: 1,
            y: 0,
            duration: 0.7,
            clearProps: "all"
        })
        .to(".projects .section-title", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            clearProps: "all"
        }, "-=0.4")
        .to(".project-showcase", {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
            onComplete: () => {
                setTimeout(() => {
                    const projectCard = document.querySelector('.project-card-single');
                    if (projectCard) projectCard.style.pointerEvents = 'auto';
                }, 300);
            }
        }, "-=0.4");
    }

    // ------------------------------------------
    // Timeline: Seção CONTATO
    // ------------------------------------------

    contactTimeline() {
        // Desabilita interação durante animação
        document.querySelectorAll('.contact-main-card, .social-card').forEach(el => {
            el.classList.add('animating');
            el.style.pointerEvents = 'none';
            el.style.cursor = 'not-allowed';
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".contact-cta",
                start: "top 50%",
                once: true
            }
        });

        tl.to(".contact-cta .section-label", {
            opacity: 1,
            y: 0,
            duration: 0.7,
            clearProps: "opacity,y,transform"
        })
        .to(".contact-cta h2", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            clearProps: "opacity,y,transform"
        }, "-=0.4")
        .to(".contact-description", {
            opacity: 1,
            y: 0,
            duration: 0.9,
            clearProps: "opacity,y,transform"
        }, "-=0.5")
        .to(".contact-main-card", {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.14,
            ease: "power2.out",
            clearProps: "opacity,y,transform"
        }, "-=0.4")
        .to(".contact-divider", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "opacity,y,transform"
        })
        .to(".contact-divider", {
            "--line-opacity": 1,
            "--line-scale": 1,
            duration: 0.8,
            ease: "power3.out"
        })
        .to(".social-card", {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => {
                    // Reabilita interação
                    document.querySelectorAll('.contact-main-card, .social-card').forEach(el => {
                        el.classList.remove('animating');
                        el.style.pointerEvents = 'auto';
                        el.style.cursor = 'pointer';
                        gsap.set(el, { clearProps: "all" });
                    });

                    // Inicia animação do footer
                    this.footerTimeline();
                }, 500);
            }
        });
    }

    // ------------------------------------------
    // Timeline: FOOTER
    // ------------------------------------------

    footerTimeline() {
        const isMobileOrTablet = window.innerWidth <= 1024;

        if (isMobileOrTablet) {
            // Versão mobile/tablet com ScrollTrigger
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: ".footer",
                    start: "top 70%",
                    once: true
                }
            });

            tl.to(".footer-column", {
                opacity: 1,
                y: 0,
                duration: 0.7,
                stagger: 0.15,
                ease: "power2.out",
                clearProps: "all"
            })
            .to(".footer-brand", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                clearProps: "all"
            }, "-=0.4")
            .to(".footer-bottom", {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power2.out",
                clearProps: "all"
            }, "-=0.5");

        } else {
            // Versão desktop sem ScrollTrigger
            const tl = gsap.timeline();

            tl.to(".footer-brand", {
                opacity: 1,
                y: 0,
                duration: 0.7,
                clearProps: "all"
            })
            .to(".footer-column", {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.12,
                clearProps: "all"
            }, "-=0.4")
            .to(".footer-bottom", {
                opacity: 1,
                y: 0,
                duration: 0.7,
                clearProps: "all"
            }, "-=0.4");
        }
    }

    // ==========================================
    // EFEITOS HOVER
    // ==========================================

    initHoverEffects() {
        this.cvCardHover();
        this.serviceCardsHover();
        this.socialCardsHover();
        this.contactMainCardsHover();
        this.projectCardsHover();
    }

    // ------------------------------------------
    // Hover: CV Card
    // ------------------------------------------

    // ------------------------------------------
// Hover: CV Card
// ------------------------------------------

cvCardHover() {
    const cvCard = document.querySelector(".cv-card");
    if (!cvCard) return;

    const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (isMobile) return;

    let tween;

    cvCard.addEventListener("mouseenter", () => {
        if (cvCard.style.pointerEvents === 'none') return;
        tween?.kill();
        tween = gsap.to(cvCard, {
            y: -6,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true
        });
    });

    cvCard.addEventListener("mouseleave", () => {
        if (cvCard.style.pointerEvents === 'none') return;
        tween?.kill();
        tween = gsap.to(cvCard, {
            y: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: true
        });
    });
}

    // ------------------------------------------
    // Hover: Service Cards
    // ------------------------------------------

    serviceCardsHover() {
        const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (isMobile) return;

        document.querySelectorAll(".service-card").forEach(card => {
            let tween;

            card.addEventListener("mouseenter", () => {
                if (card.style.pointerEvents === 'none') return;
                tween?.kill();
                tween = gsap.to(card, {
                    y: -6,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: true
                });
            });

            card.addEventListener("mouseleave", () => {
                if (card.style.pointerEvents === 'none') return;
                tween?.kill();
                tween = gsap.to(card, {
                    y: 0,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: true
                });
            });
        });
    }

    // ------------------------------------------
    // Hover: Social Cards
    // ------------------------------------------

    socialCardsHover() {
        const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (isMobile) return;

        document.querySelectorAll(".social-card").forEach(card => {
            let tween;

            card.addEventListener("mouseenter", () => {
                if (card.style.pointerEvents === 'none') return;
                tween?.kill();
                tween = gsap.to(card, {
                    y: -6,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: true
                });
            });

            card.addEventListener("mouseleave", () => {
                if (card.style.pointerEvents === 'none') return;
                tween?.kill();
                tween = gsap.to(card, {
                    y: 0,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: true
                });
            });
        });
    }

    // ------------------------------------------
    // Hover: Contact Main Cards
    // ------------------------------------------

    contactMainCardsHover() {
        const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (isMobile) return;

        document.querySelectorAll(".contact-main-card").forEach(card => {
            let tween;

            card.addEventListener("mouseenter", () => {
                if (card.style.pointerEvents === 'none') return;
                tween?.kill();
                tween = gsap.to(card, {
                    y: -6,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: true
                });
            });

            card.addEventListener("mouseleave", () => {
                if (card.style.pointerEvents === 'none') return;
                tween?.kill();
                tween = gsap.to(card, {
                    y: 0,
                    duration: 0.35,
                    ease: "power2.out",
                    overwrite: true
                });
            });
        });
    }

    // ------------------------------------------
    // Hover: Project Cards
    // ------------------------------------------

    projectCardsHover() {
        const projectCard = document.querySelector(".project-card-single");
        if (!projectCard) return;

        const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
        if (isMobile) return;

        let tween;

        projectCard.addEventListener("mouseenter", () => {
            if (projectCard.style.pointerEvents === 'none') return;
            tween?.kill();
            tween = gsap.to(projectCard, {
                y: -10,
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
            });
        });

        projectCard.addEventListener("mouseleave", () => {
            if (projectCard.style.pointerEvents === 'none') return;
            tween?.kill();
            tween = gsap.to(projectCard, {
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: true
            });
        });
    }

    // ==========================================
    // NAVEGAÇÃO
    // ==========================================

    /**
     * Inicializa comportamento da navbar:
     * - Adiciona classe 'scrolled' ao rolar
     * - Marca link ativo conforme seção visível
     * - Smooth scroll ao clicar nos links
     */
    initNavbar() {
        // Adiciona classe 'scrolled' ao rolar
        ScrollTrigger.create({
            start: 'top -80',
            end: 99999,
            toggleClass: {
                className: 'scrolled',
                targets: '.navbar'
            }
        });

        const navLinks = document.querySelectorAll('.navbar .nav-link');
        const sections = document.querySelectorAll('section[id]');

        if (sections.length === 0) return;

        const headerOffset = 80;
        let ticking = false;

        // Marca link ativo conforme scroll
        const setActiveLink = () => {
            const scrollPos = window.scrollY + headerOffset + 100;

            sections.forEach(section => {
                const top = section.offsetTop;
                const height = section.offsetHeight;
                const id = section.getAttribute('id');

                if (scrollPos >= top && scrollPos < top + height) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });

            ticking = false;
        };

        // Debounce com requestAnimationFrame
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(setActiveLink);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
        window.addEventListener('load', setActiveLink);
        setActiveLink();

        // Smooth scroll ao clicar
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (!href || !href.startsWith('#')) return;

                e.preventDefault();
                const target = document.querySelector(href);
                if (!target) return;

                const y = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });

                setTimeout(setActiveLink, 100);
            });
        });
    }

    // ==========================================
    // MENU MOBILE
    // ==========================================

    /**
     * Controla abertura/fechamento do menu mobile:
     * - Toggle ao clicar no botão
     * - Fecha com ESC
     * - Fecha ao clicar em link
     * - Fecha ao clicar fora
     */
    initMobileMenu() {
        const toggle = document.querySelector('.menu-toggle');
        const navbar = document.querySelector('.navbar');
        const menu = document.getElementById('primary-menu');

        if (!toggle || !navbar || !menu) return;

        // Função para fechar menu
        const closeMenu = () => {
            navbar.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
            document.documentElement.classList.remove('menu-open');
            document.body.classList.remove('menu-open');
        };

        // Toggle menu
        toggle.addEventListener('click', () => {
            const isOpen = navbar.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', String(isOpen));

            if (isOpen) {
                document.documentElement.classList.add('menu-open');
                document.body.classList.add('menu-open');
            } else {
                document.documentElement.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
            }
        });

        // Fecha com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });

        // Fecha ao clicar em link
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Fecha ao clicar fora
        document.addEventListener('click', (e) => {
            if (navbar.classList.contains('nav-open') &&
                !navbar.contains(e.target) &&
                !toggle.contains(e.target)) {
                closeMenu();
            }
        });
    }

    // ==========================================
    // SCROLL TO TOP
    // ==========================================

    /**
     * Botão de voltar ao topo:
     * - Aparece após 300px de scroll
     * - Clique ou Enter/Space rola para o topo
     */
    initScrollToTop() {
        const scrollTopBtn = document.querySelector('.scroll-top');
        if (!scrollTopBtn) return;

        let ticking = false;

        // Mostra/esconde botão
        const updateButton = () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
            ticking = false;
        };

        // Debounce
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateButton);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });

        // Ação de scroll
        const scrollTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        scrollTopBtn.addEventListener('click', scrollTop);
        scrollTopBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollTop();
            }
        });
    }

    // ==========================================
    // SCROLL INDICATOR
    // ==========================================

    /**
     * Indicador de scroll na hero:
     * - Desaparece após 100px de scroll
     * - Clique rola para seção "sobre"
     */
    initScrollIndicator() {
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (!scrollIndicator) return;

        // Clique rola para "sobre"
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('#sobre');
            if (aboutSection) {
                window.scrollTo({
                    top: aboutSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });

        let ticking = false;

        // Mostra/esconde indicador
        const updateIndicator = () => {
            if (window.scrollY > 100) {
                gsap.to(scrollIndicator, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: 'power2.out',
                    pointerEvents: 'none'
                });
            } else {
                gsap.to(scrollIndicator, {
                    opacity: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power2.out',
                    pointerEvents: 'auto'
                });
            }
            ticking = false;
        };

        // Debounce
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateIndicator);
                ticking = true;
            }
        };

        window.addEventListener('scroll', requestTick, { passive: true });
    }

    // ==========================================
    // SMOOTH SCROLL
    // ==========================================

    /**
     * Smooth scroll para todos os links âncora (#)
     */
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#' || !href.startsWith('#')) return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();
                const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
            });
        });
    }

    // ==========================================
    // REFRESH SCROLLTRIGGER
    // ==========================================

    /**
     * Atualiza ScrollTrigger após inicialização
     */
    refreshScrollTrigger() {
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 100);
    }
}

// ==========================================
// START APPLICATION
// ==========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWhenReady);
} else {
    initWhenReady();
}