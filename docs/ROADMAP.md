# Roadmap & Demandas Futuras: Radio Gmais

## Fase Atual (MVP Local / Centralizado)
- Estrutura base de gestão de músicas, jingles e chamadas.
- Geração de chamadas com Locutor Virtual (TTS).
- Streaming básico em servidor central.

## Arquitetura Multi-loja e Offline-First (Prioridade Futura)
**Problema:** Lojas dependem de VPN/Internet constante. Se a conexão cair, a rádio não pode parar.
**Solução Planejada:** Arquitetura Híbrida (Matriz-Filial) com operação offline (Edge).

### 1. Sistema Central (Base Padrão)
- O servidor atual servirá como o **Painel Central (Matriz)**.
- Todas as configurações, mídias e painel administrativo viverão primariamente nele.

### 2. Gestão de Conteúdo Multi-loja
- **Segmentação por Loja:** No momento do upload (ou criação de playlist), haverá a funcionalidade de "Atribuir Lojas" (ex: "Enviar para Loja 1, Loja 2", ou "Todas as lojas").
- **Clonagem/Espelhamento:** Ferramenta para igualar base de dados de músicas ou perfis de configuração de uma filial para a outra ("Copiar perfil da Matriz para Filial B").

### 3. Operação Offline nos Clientes (Filiais)
- As filiais não farão streaming ao vivo do servidor da matriz.
- Elas receberão uma **"Carga / Sync"** (Payload) pela rede.
- As filiais farão o download físico do MP3/Áudios e do JSON da playlist para um banco local.
- **Player Resiliente:** Se a rede (VPN/Internet) cair, o player da filial usa o banco local pré-baixado e continua rodando indefinidamente de forma autônoma (Offline-First).
- Assim que a rede volta, ele verifica se existe "nova carga" e atualiza em background.

### 4. Agendamento e Automação (Kiosk Mode)
- **Grade de Horários:** Configuração centralizada dos dias e horários de funcionamento (Ex: Seg a Sab, das 07:00 às 22:00).
- **Auto-Start / Resiliência a Restart:** Se o computador da filial for reiniciado por queda de energia no meio do expediente, o sistema cliente da rádio deve inicializar automaticamente junto com o Windows/Linux (auto-start) e já começar a tocar.
- **Kiosk / Desktop App:** Para garantir essas funcionalidades (auto-start e persistência), o Módulo da Filial/Loja não será apenas um site no navegador, mas sim um aplicativo instalável (como Electron ou Tauri) instalado na máquina do supermercado.

### 5. Lógica de Sequenciamento (Grade/Blocos de Programação)
- O motor de reprodução não será apenas um `while(true) { tocaPlaylist() }`.
- O sistema usará um **Padrão de Rotação (Sequenciador)**. Exemplo de regra:
   1. Música da Playlist 1 (ex: MPB)
   2. Música da Playlist 2 (ex: Pop)
   3. Música da Playlist 2 (ex: Pop)
   4. **Chamada / Vinheta Comercial**
   5. Retorna ao início do padrão.
- Nas playlists, haverá opção de **Modo de Extração**:
   - `Sequencial`: Pega a próxima música da lista seguindo a ordem (1,2,3...).
   - `Aleatório (Shuffle)`: Pega uma música ao acaso que ainda não tocou recentemente.
