#define MyAppName "Radio Gmais"
#define MyAppVersion "0.1.0"
#define MyAppPublisher "Marcos Barros"
#define MyAppURL "https://github.com/marcosbarrosdemiranda/radio-gmais"

; --- CONFIGURAÇÃO ---
; Altere abaixo se deseja gerar instalador para Matriz ou Filial
; Para automatizar, você pode passar isso via linha de comando do Inno Setup
#define Edicao "Filial"

[Setup]
AppId={{C6E25B12-A3D4-4B5C-8E1A-1234567890AB}
AppName={#MyAppName} - {#Edicao}
AppVersion={#MyAppVersion}
DefaultDirName={autopf}\RadioGmais\{#Edicao}
OutputBaseFilename=Setup_RadioGmais_{#Edicao}
OutputDir=.\dist
Compression=lzma
SolidCompression=yes
PrivilegesRequired=admin

[Languages]
Name: "pt_BR"; MessagesFile: "compiler:Languages\BrazilianPortuguese.isl"

[Files]
; --- ARQUIVOS ESSENCIAIS (NODE.JS / NEXT.JS) ---
Source: "C:\Claude Code\radio-gmais\.next\*"; DestDir: "{app}\.next"; Flags: recursesubdir
Source: "C:\Claude Code\radio-gmais\public\*"; DestDir: "{app}\public"; Flags: recursesubdir
Source: "C:\Claude Code\radio-gmais\package.json"; DestDir: "{app}"
Source: "C:\Claude Code\radio-gmais\node_modules\*"; DestDir: "{app}\node_modules"; Flags: recursesubdir
Source: "C:\Claude Code\radio-gmais\start.bat"; DestDir: "{app}"

; --- CONFIGURAÇÃO ESPECÍFICA POR EDIÇÃO ---
#if Edicao == "Filial"
Source: "C:\Claude Code\radio-gmais\data\radio-gmais.db"; DestDir: "{app}\data"; Flags: ignoreversion
#endif

#if Edicao == "Matriz"
; Aqui você pode colocar arquivos exclusivos da matriz no futuro
#endif

[Icons]
Name: "{autoprograms}\{#MyAppName} {#Edicao}"; Filename: "{app}\start.bat"

[Run]
Filename: "{app}\start.bat"; Description: "Iniciar Radio Gmais"; Flags: nowait postinstall skipifsilent
