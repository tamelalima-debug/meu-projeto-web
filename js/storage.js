/* ============================================
   STORAGE.JS - ARMAZENAMENTO LOCAL
   Gerenciamento de dados no localStorage
   ============================================ */

function inicializarStorage() {
    console.log('💾 Inicializando sistema de armazenamento...');
    
    // Verificar suporte ao localStorage
    if (!verificarSuporteStorage()) {
        console.warn('⚠️ localStorage não suportado');
        return;
    }
    
    // Inicializar estrutura de dados
    inicializarEstruturaDados();
    
    // Exibir estatísticas
    exibirEstatisticas();
}

// ===== VERIFICAR SUPORTE =====
function verificarSuporteStorage() {
    try {
        const teste = '__storage_test__';
        localStorage.setItem(teste, teste);
        localStorage.removeItem(teste);
        return true;
    } catch (e) {
        return false;
    }
}

// ===== ESTRUTURA DE DADOS =====
function inicializarEstruturaDados() {
    if (!localStorage.getItem('ong_dados')) {
        const estruturaInicial = {
            voluntarios: [],
            projetos: [],
            doacoes: [],
            configuracoes: {
                tema: 'lilas',
                notificacoes: true
            },
            versao: '1.0.0'
        };
        
        localStorage.setItem('ong_dados', JSON.stringify(estruturaInicial));
        console.log('✅ Estrutura de dados inicializada');
    }
}

// ===== VOLUNTÁRIOS =====

function salvarVoluntario(dados) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    
    const voluntario = {
        id: gerarID(),
        ...dados,
        dataCadastro: new Date().toISOString(),
        status: 'pendente'
    };
    
    ongDados.voluntarios.push(voluntario);
    localStorage.setItem('ong_dados', JSON.stringify(ongDados));
    
    console.log('✅ Voluntário salvo:', voluntario.nome);
    
    // Disparar evento customizado
    window.dispatchEvent(new CustomEvent('voluntario-cadastrado', { 
        detail: voluntario 
    }));
    
    return voluntario;
}

function listarVoluntarios() {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    return ongDados.voluntarios || [];
}

function buscarVoluntario(id) {
    const voluntarios = listarVoluntarios();
    return voluntarios.find(v => v.id === id);
}

function atualizarVoluntario(id, dadosAtualizados) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    const index = ongDados.voluntarios.findIndex(v => v.id === id);
    
    if (index !== -1) {
        ongDados.voluntarios[index] = {
            ...ongDados.voluntarios[index],
            ...dadosAtualizados,
            dataAtualizacao: new Date().toISOString()
        };
        
        localStorage.setItem('ong_dados', JSON.stringify(ongDados));
        console.log('✅ Voluntário atualizado');
        return true;
    }
    
    return false;
}

function removerVoluntario(id) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    ongDados.voluntarios = ongDados.voluntarios.filter(v => v.id !== id);
    localStorage.setItem('ong_dados', JSON.stringify(ongDados));
    console.log('🗑️ Voluntário removido');
}

// ===== PROJETOS =====

function salvarProjeto(dados) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    
    const projeto = {
        id: gerarID(),
        ...dados,
        dataCriacao: new Date().toISOString(),
        visualizacoes: 0,
        curtidas: 0
    };
    
    ongDados.projetos.push(projeto);
    localStorage.setItem('ong_dados', JSON.stringify(ongDados));
    
    console.log('✅ Projeto salvo:', projeto.titulo);
    return projeto;
}

function listarProjetos() {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    return ongDados.projetos || [];
}

function incrementarVisualizacoes(projetoId) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    const projeto = ongDados.projetos.find(p => p.id === projetoId);
    
    if (projeto) {
        projeto.visualizacoes++;
        localStorage.setItem('ong_dados', JSON.stringify(ongDados));
    }
}

function curtirProjeto(projetoId) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    const projeto = ongDados.projetos.find(p => p.id === projetoId);
    
    if (projeto) {
        projeto.curtidas++;
        localStorage.setItem('ong_dados', JSON.stringify(ongDados));
        console.log('❤️ Projeto curtido');
        return projeto.curtidas;
    }
    
    return 0;
}

// ===== DOAÇÕES =====

function salvarDoacao(dados) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    
    const doacao = {
        id: gerarID(),
        ...dados,
        data: new Date().toISOString()
    };
    
    ongDados.doacoes.push(doacao);
    localStorage.setItem('ong_dados', JSON.stringify(ongDados));
    
    console.log('💰 Doação registrada:', dados.valor);
    return doacao;
}

function listarDoacoes() {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    return ongDados.doacoes || [];
}

function calcularTotalDoacoes() {
    const doacoes = listarDoacoes();
    return doacoes.reduce((total, doacao) => total + parseFloat(doacao.valor || 0), 0);
}

// ===== ESTATÍSTICAS =====

function exibirEstatisticas() {
    const stats = obterEstatisticas();
    console.log('📊 Estatísticas da ONG:', stats);
}

function obterEstatisticas() {
    const voluntarios = listarVoluntarios();
    const projetos = listarProjetos();
    const doacoes = listarDoacoes();
    
    return {
        totalVoluntarios: voluntarios.length,
        voluntariosPendentes: voluntarios.filter(v => v.status === 'pendente').length,
        voluntariosAtivos: voluntarios.filter(v => v.status === 'ativo').length,
        totalProjetos: projetos.length,
        totalDoacoes: doacoes.length,
        valorTotalDoacoes: calcularTotalDoacoes(),
        projetoMaisVisto: projetos.sort((a, b) => b.visualizacoes - a.visualizacoes)[0],
        ultimoCadastro: voluntarios[voluntarios.length - 1]
    };
}

// ===== CONFIGURAÇÕES =====

function salvarConfiguracao(chave, valor) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    ongDados.configuracoes[chave] = valor;
    localStorage.setItem('ong_dados', JSON.stringify(ongDados));
    console.log(`⚙️ Configuração ${chave} atualizada`);
}

function obterConfiguracao(chave) {
    const ongDados = JSON.parse(localStorage.getItem('ong_dados'));
    return ongDados.configuracoes[chave];
}

// ===== BACKUP E RESTAURAÇÃO =====

function exportarDados() {
    const dados = localStorage.getItem('ong_dados');
    const blob = new Blob([dados], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ong-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    console.log('💾 Dados exportados');
}

function importarDados(arquivo) {
    const reader = new FileReader();
    
    reader.onload = (e) => {
        try {
            const dados = JSON.parse(e.target.result);
            localStorage.setItem('ong_dados', JSON.stringify(dados));
            console.log('✅ Dados importados com sucesso');
            window.location.reload();
        } catch (error) {
            console.error('❌ Erro ao importar dados:', error);
            alert('Erro ao importar arquivo. Verifique se o formato está correto.');
        }
    };
    
    reader.readAsText(arquivo);
}

function limparDados() {
    if (confirm('⚠️ Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita.')) {
        localStorage.removeItem('ong_dados');
        console.log('🗑️ Dados limpos');
        window.location.reload();
    }
}

// ===== UTILITÁRIOS =====

function gerarID() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR');
}

// ===== EVENTOS CUSTOMIZADOS =====

// Escutar cadastro de voluntário
window.addEventListener('voluntario-cadastrado', (e) => {
    console.log('🎉 Novo voluntário cadastrado:', e.detail.nome);
    
    // Atualizar contador na interface
    atualizarContadores();
});

function atualizarContadores() {
    const stats = obterEstatisticas();
    
    // Atualizar elemento na página se existir
    const contadorVoluntarios = document.getElementById('contador-voluntarios');
    if (contadorVoluntarios) {
        contadorVoluntarios.textContent = stats.totalVoluntarios;
    }
}

// ===== EXPORTAR PARA ESCOPO GLOBAL =====

window.Storage = {
    // Voluntários
    salvarVoluntario,
    listarVoluntarios,
    buscarVoluntario,
    atualizarVoluntario,
    removerVoluntario,
    
    // Projetos
    salvarProjeto,
    listarProjetos,
    incrementarVisualizacoes,
    curtirProjeto,
    
    // Doações
    salvarDoacao,
    listarDoacoes,
    calcularTotalDoacoes,
    
    // Estatísticas
    obterEstatisticas,
    
    // Configurações
    salvarConfiguracao,
    obterConfiguracao,
    
    // Backup
    exportarDados,
    importarDados,
    limparDados
};