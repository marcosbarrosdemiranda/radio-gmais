# Estrutura de Distribuição: Matriz vs Filial

## 1. Mapeamento de Componentes

| Arquivo/Pasta | Responsabilidade | Matriz | Filial |
| :--- | :--- | :---: | :---: |
| `src/app/api/admin/...` | Rotas administrativas | Sim | Não |
| `src/app/api/player/...` | Lógica de reprodução | Sim | Sim |
| `src/app/(player)/...` | Interface principal do player | Sim | Sim |
| `src/app/(admin)/...` | Interface administrativa | Sim | Não |
| `server_xtts.py` | Locutor Virtual (IA) | Sim | Não |
| `data/radio-gmais.db` | Banco de dados sincronizado | Central | Local/Slave |

## 2. Estratégia de Build

Para viabilizar a criação dos instaladores, utilizaremos variáveis de ambiente no `next.config.ts`:

- `IS_FILIAL=true` (Build para filial): Reduz o conjunto de páginas e desativa endpoints de admin.
- `IS_FILIAL=false` (Build para matriz): Compila tudo.

## 3. Próximos passos para o instalador
- Criar script `scripts/build-filial.sh` (ou `.ps1`).
- Adicionar lógica de pré-build para remover pastas desnecessárias nas filiais.
