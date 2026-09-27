# Controle Remoto de Filiais (Matriz -> Filial)

## Objetivo
Permitir que a central (Matriz) envie comandos remotos para instâncias de Filiais específicas.

## Funcionalidades
- **Playback Control**: Tocar / Pausar.
- **Volume Control**: Ajustar volume remotamente.

## Requisitos Técnicos
- **Canal de Comando**: WebSockets ou Webhooks bidirecionais entre Matriz e Filial.
- **Identificação**: Cada Filial deve possuir um ID único para receber comandos direcionados.

Co-Authored-By: Claude Code <noreply@anthropic.com>
