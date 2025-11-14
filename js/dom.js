/* ============================================
   DOM.JS - MANIPULAÇÃO DO DOM
   Funções para manipular elementos da página
   ============================================ */

function inicializarDOM() {
    console.log('📋 Inicializando manipulação DOM...');
    
    // Menu Hambúrguer
    configurarMenuHamburguer();
    
    // Animações de scroll
    configurarAnimacoesScroll();
    
    // Contador de impacto
    configurarContadores();
    
    // Sistema de abas
    configurarAbas();
    
    // Tooltips
    configurarTooltips();
}

// ===== MENU HAMBÚRGUER =====
function configurarMenuHamburguer() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (!hamburger || !navMenu) return;
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Acessibilidade
        const isOpen = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isOpen);
        navMenu.setAttribute('aria-hidden', !isOpen);
        
        console.log(`🍔 Menu ${isOpen ? 'aberto' : 'fechado'}`);
    });
    
    // Fechar menu ao clicar em link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// ===== ANIMAÇÕES DE SCROLL =====
function configurarAnimacoesScroll() {
    // Revelar elementos ao scrollar
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // Smooth scroll para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== CONTADORES ANIMADOS =====
function configurarContadores() {
    const contadores = document.querySelectorAll('.card-title');
    
    contadores.forEach(contador => {
        const texto = contador.textContent;
        const numero = parseInt(texto.replace(/\D/g, ''));
        
        if (!numero || numero === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animarContador(contador, numero, texto);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(contador);
    });
}

function animarContador(elemento, valorFinal, textoOriginal) {
    const duracao = 2000; // 2 segundos
    const incremento = valorFinal / (duracao / 16);
    let valorAtual = 0;
    
    const timer = setInterval(() => {
        valorAtual += incremento;
        
        if (valorAtual >= valorFinal) {
            elemento.textContent = textoOriginal;
            clearInterval(timer);
        } else {
            const sufixo = textoOriginal.includes('+') ? '+' : '';
            elemento.textContent = Math.floor(valorAtual) + sufixo;
        }
    }, 16);
}

// ===== SISTEMA DE ABAS =====
function configurarAbas() {
    const tabs = document.querySelectorAll('[data-tab]');
    const contents = document.querySelectorAll('[data-tab-content]');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Remover active de todas
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            // Adicionar active na selecionada
            tab.classList.add('active');
            document.querySelector(`[data-tab-content="${target}"]`)?.classList.add('active');
        });
    });
}

// ===== TOOLTIPS =====
function configurarTooltips() {
    document.querySelectorAll('[data-tooltip]').forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = e.target.dataset.tooltip;
            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = 'var(--primary-dark)';
            tooltip.style.color = 'var(--neutral-white)';
            tooltip.style.padding = 'var(--space-1) var(--space-2)';
            tooltip.style.borderRadius = 'var(--radius-md)';
            tooltip.style.fontSize = 'var(--font-sm)';
            tooltip.style.zIndex = '1000';
            tooltip.style.pointerEvents = 'none';
            
            document.body.appendChild(tooltip);
            
            const rect = e.target.getBoundingClientRect();
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 5}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)}px`;
            
            e.target.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });
}

// ===== UTILITÁRIOS DOM =====
const DOMUtils = {
    // Criar elemento com atributos
    createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'class') {
                element.className = value;
            } else if (key === 'style') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });
        
        return element;
    },
    
    // Mostrar/ocultar elemento
    toggle(selector, show) {
        const element = document.querySelector(selector);
        if (!element) return;
        
        if (show === undefined) {
            element.style.display = element.style.display === 'none' ? '' : 'none';
        } else {
            element.style.display = show ? '' : 'none';
        }
    },
    
    // Adicionar classe com animação
    addClassAnimated(selector, className, delay = 0) {
        setTimeout(() => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add(className);
            }
        }, delay);
    }
};

// Exportar para escopo global
window.DOMUtils = DOMUtils;