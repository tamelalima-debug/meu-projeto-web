/* ============================================
   VALIDACAO.JS - VALIDAÇÃO DE FORMULÁRIOS
   Sistema completo de validação com feedback
   ============================================ */

function inicializarValidacao() {
    console.log('✅ Inicializando sistema de validação...');
    
    const formulario = document.getElementById('form-voluntario');
    
    if (!formulario) {
        console.log('ℹ️ Formulário não encontrado nesta página');
        return;
    }
    
    // Validação em tempo real
    configurarValidacaoTempoReal(formulario);
    
    // Validação no submit
    configurarValidacaoSubmit(formulario);
    
    // Máscaras de input
    configurarMascaras();
    
    // Feedback visual
    configurarFeedbackVisual();
}

// ===== VALIDAÇÃO EM TEMPO REAL =====
function configurarValidacaoTempoReal(formulario) {
    const campos = formulario.querySelectorAll('input, select, textarea');
    
    campos.forEach(campo => {
        // Validar ao perder foco
        campo.addEventListener('blur', () => {
            validarCampo(campo);
        });
        
        // Remover erro ao digitar
        campo.addEventListener('input', () => {
            if (campo.classList.contains('erro')) {
                removerErro(campo);
            }
        });
    });
}

// ===== VALIDAÇÃO NO SUBMIT =====
function configurarValidacaoSubmit(formulario) {
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        
        console.log('📝 Validando formulário...');
        
        // Limpar erros anteriores
        formulario.querySelectorAll('.erro').forEach(campo => {
            removerErro(campo);
        });
        
        // Validar todos os campos
        let formularioValido = true;
        const campos = formulario.querySelectorAll('input[required], select[required], textarea[required]');
        
        campos.forEach(campo => {
            if (!validarCampo(campo)) {
                formularioValido = false;
            }
        });
        
        if (formularioValido) {
            console.log('✅ Formulário válido!');
            processarFormulario(formulario);
        } else {
            console.log('❌ Formulário com erros!');
            mostrarAlerta('Por favor, corrija os erros no formulário.', 'error');
            
            // Focar no primeiro campo com erro
            const primeiroErro = formulario.querySelector('.erro');
            if (primeiroErro) {
                primeiroErro.focus();
                primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
}

// ===== VALIDAR CAMPO INDIVIDUAL =====
function validarCampo(campo) {
    const valor = campo.value.trim();
    const tipo = campo.type;
    const nome = campo.name;
    
    // Verificar se é obrigatório e está vazio
    if (campo.hasAttribute('required') && !valor) {
        mostrarErro(campo, 'Este campo é obrigatório');
        return false;
    }
    
    // Validações específicas por tipo
    switch (nome) {
        case 'nome':
            return validarNome(campo, valor);
        
        case 'email':
            return validarEmail(campo, valor);
        
        case 'cpf':
            return validarCPF(campo, valor);
        
        case 'telefone':
            return validarTelefone(campo, valor);
        
        case 'cep':
            return validarCEP(campo, valor);
        
        case 'data-nascimento':
            return validarIdade(campo, valor);
        
        default:
            return true;
    }
}

// ===== VALIDAÇÕES ESPECÍFICAS =====

function validarNome(campo, valor) {
    if (valor.length < 3) {
        mostrarErro(campo, 'Nome deve ter no mínimo 3 caracteres');
        return false;
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(valor)) {
        mostrarErro(campo, 'Nome deve conter apenas letras');
        return false;
    }
    
    const palavras = valor.split(' ').filter(p => p.length > 0);
    if (palavras.length < 2) {
        mostrarErro(campo, 'Digite seu nome completo');
        return false;
    }
    
    mostrarSucesso(campo);
    return true;
}

function validarEmail(campo, valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!regex.test(valor)) {
        mostrarErro(campo, 'Digite um e-mail válido');
        return false;
    }
    
    mostrarSucesso(campo);
    return true;
}

function validarCPF(campo, valor) {
    // Remover pontos e traços
    const cpfLimpo = valor.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
        mostrarErro(campo, 'CPF deve ter 11 dígitos');
        return false;
    }
    
    // Verificar se não é uma sequência repetida
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
        mostrarErro(campo, 'CPF inválido');
        return false;
    }
    
    // Validar dígitos verificadores
    if (!validarDigitosCPF(cpfLimpo)) {
        mostrarErro(campo, 'CPF inválido');
        return false;
    }
    
    mostrarSucesso(campo);
    return true;
}

function validarDigitosCPF(cpf) {
    let soma = 0;
    let resto;
    
    // Validar primeiro dígito
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    // Validar segundo dígito
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function validarTelefone(campo, valor) {
    const telefoneLimpo = valor.replace(/\D/g, '');
    
    if (telefoneLimpo.length !== 11) {
        mostrarErro(campo, 'Telefone deve ter 11 dígitos (DDD + número)');
        return false;
    }
    
    mostrarSucesso(campo);
    return true;
}

function validarCEP(campo, valor) {
    const cepLimpo = valor.replace(/\D/g, '');
    
    if (cepLimpo.length !== 8) {
        mostrarErro(campo, 'CEP deve ter 8 dígitos');
        return false;
    }
    
    mostrarSucesso(campo);
    return true;
}

function validarIdade(campo, valor) {
    const dataNascimento = new Date(valor);
    const hoje = new Date();
    let idade = hoje.getFullYear() - dataNascimento.getFullYear();
    const mes = hoje.getMonth() - dataNascimento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoje.getDate() < dataNascimento.getDate())) {
        idade--;
    }
    
    if (idade < 18) {
        mostrarErro(campo, 'Você deve ter no mínimo 18 anos');
        return false;
    }
    
    if (idade > 100) {
        mostrarErro(campo, 'Data inválida');
        return false;
    }
    
    mostrarSucesso(campo);
    return true;
}

// ===== FEEDBACK VISUAL =====

function mostrarErro(campo, mensagem) {
    removerFeedback(campo);
    
    campo.classList.add('erro');
    campo.style.borderColor = 'var(--error)';
    
    const divErro = document.createElement('div');
    divErro.className = 'form-error';
    divErro.textContent = mensagem;
    divErro.style.color = 'var(--error)';
    divErro.style.fontSize = 'var(--font-sm)';
    divErro.style.marginTop = 'var(--space-1)';
    
    campo.parentElement.appendChild(divErro);
    
    // Adicionar ícone de erro
    adicionarIcone(campo, '❌');
}

function mostrarSucesso(campo) {
    removerFeedback(campo);
    
    campo.classList.add('sucesso');
    campo.style.borderColor = 'var(--success)';
    
    // Adicionar ícone de sucesso
    adicionarIcone(campo, '✅');
}

function removerErro(campo) {
    campo.classList.remove('erro');
    campo.style.borderColor = '';
    removerFeedback(campo);
}

function removerFeedback(campo) {
    campo.classList.remove('erro', 'sucesso');
    campo.style.borderColor = '';
    
    const erro = campo.parentElement.querySelector('.form-error');
    if (erro) erro.remove();
    
    const icone = campo.parentElement.querySelector('.campo-icone');
    if (icone) icone.remove();
}

function adicionarIcone(campo, emoji) {
    const iconeExistente = campo.parentElement.querySelector('.campo-icone');
    if (iconeExistente) iconeExistente.remove();
    
    const icone = document.createElement('span');
    icone.className = 'campo-icone';
    icone.textContent = emoji;
    icone.style.position = 'absolute';
    icone.style.right = '10px';
    icone.style.top = '50%';
    icone.style.transform = 'translateY(-50%)';
    
    campo.parentElement.style.position = 'relative';
    campo.parentElement.appendChild(icone);
}

// ===== MÁSCARAS DE INPUT =====

function configurarMascaras() {
    // Máscara CPF
    const campoCPF = document.getElementById('cpf');
    if (campoCPF) {
        campoCPF.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length <= 11) {
                valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                e.target.value = valor;
            }
        });
    }
    
    // Máscara Telefone
    const campoTelefone = document.getElementById('telefone');
    if (campoTelefone) {
        campoTelefone.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length <= 11) {
                valor = valor.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                e.target.value = valor;
            }
        });
    }
    
    // Máscara CEP
    const campoCEP = document.getElementById('cep');
    if (campoCEP) {
        campoCEP.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            if (valor.length <= 8) {
                valor = valor.replace(/(\d{5})(\d{3})/, '$1-$2');
                e.target.value = valor;
            }
        });
    }
}

// ===== PROCESSAR FORMULÁRIO =====

function processarFormulario(formulario) {
    // Coletar dados
    const formData = new FormData(formulario);
    const dados = {};
    
    formData.forEach((valor, chave) => {
        dados[chave] = valor;
    });
    
    console.log('📊 Dados do formulário:', dados);
    
    // Salvar no localStorage
    salvarVoluntario(dados);
    
    // Mostrar modal de sucesso
    mostrarModalSucesso();
    
    // Limpar formulário após 2 segundos
    setTimeout(() => {
        formulario.reset();
        formulario.querySelectorAll('.sucesso, .erro').forEach(campo => {
            removerFeedback(campo);
        });
    }, 2000);
}

function mostrarModalSucesso() {
    const modal = document.getElementById('modal-sucesso');
    if (modal) {
        modal.classList.add('active');
    }
}

// ===== ALERTAS =====

function mostrarAlerta(mensagem, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensagem;
    alerta.style.position = 'fixed';
    alerta.style.top = '20px';
    alerta.style.right = '20px';
    alerta.style.zIndex = '9999';
    alerta.style.minWidth = '300px';
    alerta.style.animation = 'slideInRight 0.3s ease-out';
    
    document.body.appendChild(alerta);
    
    setTimeout(() => {
        alerta.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => alerta.remove(), 300);
    }, 5000);
}

function configurarFeedbackVisual() {
    // Adicionar estilos para animações
    if (!document.getElementById('validacao-styles')) {
        const style = document.createElement('style');
        style.id = 'validacao-styles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}