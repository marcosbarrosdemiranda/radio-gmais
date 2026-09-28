# Script de Build do Módulo de Filial (Kiosk Leve)
# Este script define a variável de ambiente para que o Next.js compile
# uma versão reduzida focada apenas em reprodução.

$env:IS_FILIAL = "true"
Write-Host "Iniciando build para Módulo Filial..."

# Executa o build do Next.js
npm run build

Write-Host "Build para Módulo Filial concluído."
