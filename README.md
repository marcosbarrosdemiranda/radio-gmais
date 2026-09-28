# Rádio Gmais - Aplicação Matriz/Filial

Este projeto é uma aplicação Next.js configurada para operar em modo Matriz (Servidor Central) ou Filial (Kiosk de reprodução).

## Como executar o Build

### 1. Build para Matriz (Servidor Completo)
Para compilar todas as funcionalidades (incluindo painel administrativo):

```bash
npm run build
```

### 2. Build para Filial (Modo Kiosk)
Para executar uma versão restrita focada em reprodução, utilize o script dedicado:

```bash
powershell -ExecutionPolicy Bypass -File scripts/build-filial.ps1
```

O sistema automaticamente restringirá acesso às rotas administrativas através do middleware (`src/middleware.ts`).
