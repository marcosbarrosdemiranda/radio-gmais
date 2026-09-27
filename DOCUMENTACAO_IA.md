# Documentação: Servidor de Voz (IA Local - Coqui XTTS)

Esta IA gera vozes extremamente naturais (clonagem) localmente, sem pagar nada e sem internet depois de baixada.

## Quando utilizar
Utilize apenas se precisar de vozes de qualidade humana para comerciais importantes. 
**Atenção:** O modelo pesa ~3GB. Só baixe quando tiver espaço em disco.

## Como ativar (Automático quando quiser)
A estrutura já está toda no projeto. Quando decidir instalar, siga estes passos:

1. **Instalar dependências (Python):**
   ```bash
   pip install TTS fastapi uvicorn torch
   ```

2. **Ativar o motor:**
   Abra um terminal na pasta do projeto e rode:
   ```bash
   python server_xtts.py
   ```
   *Na primeira vez, ele baixará o modelo (prepare o café).*

3. **Uso:**
   O botão roxo "Servidor XTTS (Local)" na aba "Locutor Virtual" da rádio começará a funcionar automaticamente. Se o terminal do Python estiver fechado, a rádio apenas mostrará um aviso amigável que o servidor está offline.
