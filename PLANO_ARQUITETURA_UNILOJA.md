# Arquitetura Uniloja (Modo Sem Filiais)

## Objetivo
Implementar um modo "Uniloja" onde a aplicação opera como uma instância única, sem separação entre Matriz e Filial. Ideal para clientes pequenos ou operações menores que não necessitam da estrutura complexa de multi-lojas.

## Requisitos
- **Configuração de Modo**: O sistema deve detectar se está rodando em modo "Matriz+Filiais" ou "Uniloja".
- **Simplificação**: No modo Uniloja, o painel central (Matriz) e o player de rádio devem residir na mesma instância.
- **Transparência**: O usuário não deve notar diferenças estruturais no painel de controle, apenas que a gestão ocorre localmente.

Co-Authored-By: Claude Code <noreply@anthropic.com>
