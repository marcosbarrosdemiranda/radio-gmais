# Configuração do Locutor Virtual (IA)

Este componente utiliza [Coqui TTS](https://github.com/coqui-ai/TTS) para gerar chamadas de voz offline.

## Instalação

1.  **Pré-requisitos**: Python 3.10 ou superior instalado.
2.  **Ambiente Virtual**:
    ```bash
    python -m venv venv
    .\venv\Scripts\activate
    ```
3.  **Dependências**:
    ```bash
    pip install -r requirements_ia.txt
    ```

## Execução

Para iniciar o servidor de voz na porta 5002:

```bash
python server_xtts.py
```

O servidor ficará disponível em `http://127.0.0.1:5002/api/tts`. O sistema Node.js já está configurado para consumir este endereço quando o motor 'coqui' for selecionado.
