document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const emailInput = loginForm.querySelector('input[type="text"]');
    const senhaInput = loginForm.querySelector('input[type="password"]');
    const btnEntrar = loginForm.querySelector('.btn-entrar');
    
    // Desabilita o botão inicialmente
    btnEntrar.disabled = true;
    btnEntrar.style.opacity = '0.6';
    btnEntrar.style.cursor = 'not-allowed';

    // Função para verificar se os campos estão preenchidos
    const verificarCampos = () => {
        const emailPreenchido = emailInput.value.trim() !== '';
        const senhaPreenchida = senhaInput.value.trim() !== '';
        
        // Habilita ou desabilita o botão baseado no preenchimento
        if (emailPreenchido && senhaPreenchida) {
            btnEntrar.disabled = false;
            btnEntrar.style.opacity = '1';
            btnEntrar.style.cursor = 'pointer';
        } else {
            btnEntrar.disabled = true;
            btnEntrar.style.opacity = '0.6';
            btnEntrar.style.cursor = 'not-allowed';
        }
    }

    // Monitora mudanças nas inputs
    emailInput.addEventListener('input', verificarCampos);
    senhaInput.addEventListener('input', verificarCampos);

    // Manipula o envio do formulário
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        window.location.href = 'https://www.facebook.com';
    });
});
