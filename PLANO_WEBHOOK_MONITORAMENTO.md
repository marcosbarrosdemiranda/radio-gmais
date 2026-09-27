# Webhook de Monitoramento (Portal-GLPI)

## Objetivo
Implementar um webhook no sistema de rádio que notifique o projeto Portal-GLPI sobre o estado de saúde e operação das instâncias (Matriz e Filiais).

## Eventos a Monitorar
- **Saúde do Servidor (Matriz):** Status de uptime e acessibilidade.
- **Status das Filiais:** Se estão online e tocando.
- **Sincronização:** Confirmação de recebimento de nova configuração/carga.
- **Alertas de Operação:** Rádio ligada / Rádio desligada.

## Documentação Adicional na Memória
- Adicionar memória: `monitoramento-webhook-glpi`
- Adicionar tarefa em `PENDENCIAS.md` (ou similar).

Co-Authored-By: Claude Code <noreply@anthropic.com>
