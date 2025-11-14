/* ============================================
   SPA.JS - SINGLE PAGE APPLICATION
   Sistema de navegação dinâmica (CORRIGIDO)
   ============================================ */

function inicializarSPA() {
    console.log('🔄 Inicializando SPA...');
    
    // Configurar templates dinâmicos
    configurarTemplates();
    
    // Configurar carregamento dinâmico de conteúdo
    configurarCarregamentoDinamico();
    
    console.log('✅ SPA inicializado (modo compatível)');
}

// ===== SISTEMA DE TEMPLATES =====
function configurarTemplates() {
    // Templates para componentes dinâmicos
    window.Templates = {
        card: (dados) => `
            <article class="card">
                <div class="card-header">
                    <h3 class="card-title">${dados.titulo}</h3>
                </div>
                <div class="card-body">
                    <p>${dados.descricao}</p>
                </div>
                ${dados.tags ? `
                    <div class="card-footer">
                        ${dados.tags.map(tag => `<span class="badge">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </article>
        `,
        
        alerta: (mensagem, tipo = 'info') => `
            <div class="alert alert-${tipo}">
                <strong>${tipo === 'success' ? '✅' : tipo === 'error' ? '❌' : 'ℹ️'}</strong>
                ${mensagem}
            </div>
        `,
        
        badge: (texto, tipo = '') => `
            <span class="badge ${tipo ? `badge-${tipo}` : ''}">${texto}</span>
        `,
        
        botao: (texto, tipo = 'primary', onclick = '') => `
            <button class="btn btn-${tipo}" ${onclick ? `onclick="${onclick}"` : ''}>
                ${texto}
            </button>
        `,
        
        projetoCard: (projeto) => `
            <article class="card" data-projeto-id="${projeto.id || ''}">
                ${projeto.imagem ? `<img src="${projeto.imagem}" alt="${projeto.titulo}" class="card-img">` : ''}
                <div class="card-header">
                    <h3 class="card-title">${projeto.icone || ''} ${projeto.titulo}</h3>
                </div>
                <div class="card-body">
                    <p>${projeto.descricao}</p>
                </div>
                <div class="card-footer">
                    ${projeto.categoria ? `<span class="badge">${projeto.categoria}</span>` : ''}
                    ${projeto.beneficiados ? `<span class="badge badge-success">${projeto.beneficiados} beneficiados</span>` : ''}
                </div>
            </article>
        `,
        
        voluntarioCard: (voluntario) => `
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">👤 ${voluntario.nome}</h3>
                </div>
                <div class="card-body">
                    <p><strong>📧 E-mail:</strong> ${voluntario.email}</p>
                    <p><strong>📞 Telefone:</strong> ${voluntario.telefone}</p>
                    <p><strong>📍 Cidade:</strong> ${voluntario.cidade}/${voluntario.estado}</p>
                    <p><strong>💼 Interesse:</strong> ${voluntario['area-interesse']}</p>
                    ${voluntario.disponibilidade ? `<p><strong>🕐 Disponibilidade:</strong> ${voluntario.disponibilidade}</p>` : ''}
                </div>
                <div class="card-footer">
                    <span class="badge badge-info">${voluntario.status || 'Pendente'}</span>
                    <small style="color: var(--neutral-gray-600);">Cadastrado em: ${formatarDataCadastro(voluntario.dataCadastro)}</small>
                </div>
            </div>
        `
    };
    
    console.log('📝 Templates configurados');
}

// ===== CARREGAMENTO DINÂMICO =====
function configurarCarregamentoDinamico() {
    // Adicionar botões de ação dinâmica se necessário
    adicionarBotoesDinamicos();
}

function adicionarBotoesDinamicos() {
    // Exemplo: Botão para carregar mais projetos
    const containerProjetos = document.querySelector('.projetos-grid, .grid-auto-fit');
    
    if (containerProjetos && window.location.pathname.includes('projetos')) {
        console.log('📦 Projetos carregados dinamicamente disponível');
    }
}

// ===== RENDERIZAR COMPONENTE =====
function renderizarComponente(containerId, template, dados) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`❌ Container ${containerId} não encontrado`);
        return false;
    }
    
    try {
        if (typeof template === 'function') {
            container.innerHTML = template(dados);
        } else if (typeof template === 'string') {
            container.innerHTML = template;
        } else {
            console.error('❌ Template inválido');
            return false;
        }
        
        console.log(`✅ Componente renderizado em #${containerId}`);
        
        // Reinicializar eventos DOM após renderização
        if (typeof inicializarDOM === 'function') {
            inicializarDOM();
        }
        
        return true;
    } catch (error) {
        console.error('❌ Erro ao renderizar componente:', error);
        return false;
    }
}

// ===== CARREGAR LISTA DE VOLUNTÁRIOS DINAMICAMENTE =====
function carregarVoluntariosDinamicamente(containerId) {
    const voluntarios = window.Storage ? window.Storage.listarVoluntarios() : [];
    
    if (voluntarios.length === 0) {
        renderizarComponente(containerId, `
            <div class="alert alert-info">
                <strong>ℹ️ Nenhum voluntário cadastrado ainda.</strong>
                <p>Seja o primeiro a se cadastrar!</p>
            </div>
        `);
        return;
    }
    
    const html = voluntarios.map(v => window.Templates.voluntarioCard(v)).join('');
    renderizarComponente(containerId, html);
    
    console.log(`✅ ${voluntarios.length} voluntários carregados`);
}

// ===== CARREGAR PROJETOS DINAMICAMENTE =====
function carregarProjetosDinamicamente(containerId) {
    const projetos = window.Storage ? window.Storage.listarProjetos() : [];
    
    if (projetos.length === 0) {
        // Projetos padrão se não houver no storage
        const projetosPadrao = [
            {
                id: 'proj1',
                titulo: 'Educação para Todos',
                icone: '📚',
                descricao: 'Reforço escolar gratuito para crianças e adolescentes.',
                categoria: 'Educação',
                beneficiados: '120'
            },
            {
                id: 'proj2',
                titulo: 'Arte e Cultura',
                icone: '🎨',
                descricao: 'Oficinas de artes, música, teatro e dança.',
                categoria: 'Cultura',
                beneficiados: '80'
            }
        ];
        
        const html = projetosPadrao.map(p => window.Templates.projetoCard(p)).join('');
        renderizarComponente(containerId, html);
        return;
    }
    
    const html = projetos.map(p => window.Templates.projetoCard(p)).join('');
    renderizarComponente(containerId, html);
    
    console.log(`✅ ${projetos.length} projetos carregados`);
}

// ===== CARREGAR ESTATÍSTICAS DINAMICAMENTE =====
function atualizarEstatisticasDinamicamente() {
    if (!window.Storage) return;
    
    const stats = window.Storage.obterEstatisticas();
    
    // Atualizar contadores na página
    const contadores = {
        'contador-voluntarios': stats.totalVoluntarios,
        'contador-projetos': stats.totalProjetos,
        'contador-doacoes': stats.totalDoacoes
    };
    
    Object.entries(contadores).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
            console.log(`✅ Contador ${id} atualizado: ${valor}`);
        }
    });
}

// ===== MODAL DINÂMICO =====
function abrirModal(titulo, conteudo) {
    // Criar modal se não existir
    let modal = document.getElementById('modal-dinamico');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modal-dinamico';
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h2 class="modal-title"></h2>
                    <span class="modal-close" onclick="fecharModal()">&times;</span>
                </div>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Fechar ao clicar fora
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                fecharModal();
            }
        });
    }
    
    modal.querySelector('.modal-title').textContent = titulo;
    modal.querySelector('.modal-body').innerHTML = conteudo;
    modal.classList.add('active');
    
    console.log('✅ Modal aberto:', titulo);
}

function fecharModal() {
    const modal = document.getElementById('modal-dinamico');
    if (modal) {
        modal.classList.remove('active');
        console.log('✅ Modal fechado');
    }
}

// ===== LOADING DINÂMICO =====
function mostrarLoading(mensagem = 'Carregando...') {
    let loading = document.getElementById('spa-loading');
    
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'spa-loading';
        loading.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
                        background: rgba(255,255,255,0.95); z-index: 9999; 
                        display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; animation: spin 1s linear infinite;">💜</div>
                    <p id="loading-message" style="margin-top: 1rem; color: var(--primary-dark); font-weight: bold;">
                        ${mensagem}
                    </p>
                </div>
            </div>
        `;
        document.body.appendChild(loading);
        
        // Adicionar animação
        if (!document.getElementById('spin-animation')) {
            const style = document.createElement('style');
            style.id = 'spin-animation';
            style.textContent = `
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
    } else {
        loading.querySelector('#loading-message').textContent = mensagem;
    }
    
    loading.style.display = 'flex';
    console.log('⏳ Loading exibido');
}

function esconderLoading() {
    const loading = document.getElementById('spa-loading');
    if (loading) {
        loading.style.display = 'none';
        console.log('✅ Loading ocultado');
    }
}

// ===== UTILITÁRIOS =====
function formatarDataCadastro(dataISO) {
    if (!dataISO) return 'Data não disponível';
    
    try {
        const data = new Date(dataISO);
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (error) {
        return 'Data inválida';
    }
}

// ===== EXPORTAR PARA ESCOPO GLOBAL =====
window.SPA = {
    // Templates
    templates: () => window.Templates,
    
    // Renderização
    renderizar: renderizarComponente,
    
    // Carregamento dinâmico
    carregarVoluntarios: carregarVoluntariosDinamicamente,
    carregarProjetos: carregarProjetosDinamicamente,
    atualizarEstatisticas: atualizarEstatisticasDinamicamente,
    
    // Modal
    abrirModal,
    fecharModal,
    
    // Loading
    mostrarLoading,
    esconderLoading
};

// Tornar fecharModal global para onclick
window.fecharModal = fecharModal;

console.log('✅ SPA.js carregado - Funções disponíveis:', Object.keys(window.SPA));