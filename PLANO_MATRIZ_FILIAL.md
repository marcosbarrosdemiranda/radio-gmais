# Plano de Transição: Arquitetura Matriz-Filial (Radio Gmais)

## Objetivo
Separar o sistema em módulos:
1. **Matriz (Gestão Centralizada)**: Painel administrativo para gestão de lojas, músicas, playlists, programação, locutor virtual e chamadas.
2. **Filiais (Kiosks Offline-First)**: Módulo focado exclusivamente em reprodução (player) com banco de dados local para resiliência offline.

## Etapas de Implementação

1. **Abstração do Banco de Dados**:
   - Mover lógica compartilhada para um pacote/pasta `core` que será consumido tanto pelo servidor da Matriz quanto pelo player das Filiais.
   - Definir schema do SQLite local para as Filiais (subset do banco central).

2. **API de Sincronização**:
   - Implementar endpoints na Matriz para "empurrar" configurações e conteúdos para as Filiais.
   - Implementar worker nas Filiais para "puxar" dados da Matriz e atualizar o banco local.

3. **Isolamento de UI/Funcionalidades**:
   - Refatorar o Next.js atual para permitir rodar apenas os módulos de player nas filiais (modo quiosque).
   - Manter o painel administrativo acessível apenas na instância da Matriz.

4. **Modo Offline-First**:
   - Player das Filiais consumirá dados exclusivamente do SQLite local.
   - Sincronização em background: download de áudios físicos quando a rede estiver disponível.

## Próximo Passo Imediato
Estruturar o projeto para permitir a compilação desse novo modelo de distribuição e iniciar a migração de configurações de horários para a base centralizada.

Co-Authored-By: Claude Code <noreply@anthropic.com>
