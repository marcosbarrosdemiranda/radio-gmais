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
