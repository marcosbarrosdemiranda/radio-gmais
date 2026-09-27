# Plano de Implementação: Arquitetura Matriz-Filial (Offline-First)

Este documento detalha o plano de refatoração para transformar a arquitetura de "centralizada" para "Matriz-Filial Offline-First".

## Etapa 1: Abstração e Preparação do Banco Local (Filial)
- [x] Criar `src/lib/db-filial.ts` (schema simplificado para Filiais).
- [x] Implementar a lógica de switch (`core/db-selector.ts`) para decidir qual DB usar baseado no modo da instância.

## Etapa 2: Infraestrutura de Sincronização (Worker/API)
- [x] Criar endpoint `api/sync/pull` na Matriz para empacotar configurações.
- [x] Implementar `SyncWorker` na Filial para consumo periódico dos dados da Matriz.
- [ ] Implementar download/cache local de conteúdos (áudios/playlists).

## Etapa 3: Isolamento de Funções e Modo Offline
- [ ] Configurar player da Filial para ler exclusivamente do `db-filial`.
- [ ] Adicionar suporte a "modo offline" com fallback de segurança.
- [ ] Impedir acesso administrativo via rotas da Filial.

## Etapa 4: Validação e Refatoração Final
- [ ] Testes de desconexão (simular queda da Matriz).
- [ ] Limpeza de código obsoleto.
- [ ] Merge final e validação com o modo Uniloja.

---
*Progresso: 1/4 etapas concluídas (Etapa 1 finalizada).*
Co-Authored-By: Code <noreply@anthropic.com>