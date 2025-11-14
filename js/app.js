/* ============================================
   APP.JS - ARQUIVO PRINCIPAL
   Inicializa todos os módulos da aplicação
   ============================================ */

// Importar módulos (simulado - no browser usamos tags script)
console.log('🚀 Aplicação ONG Esperança Solidária iniciada!');

// Configurações globais
const CONFIG = {
    nome: 'ONG Esperança Solidária',
    versao: '1.0.0',
    debug: true
};

// Função de inicialização
function inicializarApp() {
    console.log('✅ Inicializando aplicação...');
    
    // Inicializar navegação
    if (typeof inicializarNavegacao === 'function') {
        inicializarNavegacao();
    }
    
    // Inicializar SPA
    if (typeof inicializarSPA === 'function') {
        inicializarSPA();
    }
    
    // Inicializar validação de formulários
    if (typeof inicializarValidacao === 'function') {
        inicializarValidacao();
    }
    
    // Inicializar armazenamento
    if (typeof inicializarStorage === 'function') {
        inicializarStorage();
    }
    
    // Inicializar manipulação DOM
    if (typeof inicializarDOM === 'function') {
        inicializarDOM();
    }
    
    console.log('✅ Aplicação inicializada com sucesso!');
}

// Aguardar carregamento completo do DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarApp);
} else {
    inicializarApp();
}

// Função helper para debug
function log(mensagem, tipo = 'info') {
    if (!CONFIG.debug) return;
    
    const emoji = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    
    console.log(`${emoji[tipo] || 'ℹ️'} ${mensagem}`);
}

// Exportar para escopo global
window.APP = {
    config: CONFIG,
    log: log
};