# server_xtts.py
import uvicorn
from fastapi import FastAPI, Request
from fastapi.responses import Response
from TTS.api import TTS
import os
import torch

# Inicializa o app
app = FastAPI()

# Verifica se usa GPU (NVIDIA) ou apenas CPU
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"--- [Rádio GMais] Inicializando motor AI no dispositivo: {device} ---")

# Carrega o modelo XTTS v2 (vai baixar automaticamente na primeira vez)
# Usando o modelo multilingue
tts = TTS(model_name="tts_models/multilingual/multi-dataset/xtts_v2").to(device)

@app.post("/api/tts")
async def tts_endpoint(request: Request):
    data = await request.json()
    text = data.get("text")
    lang = data.get("language", "pt")

    print(f"--- Gerando voz para: {text[:30]}... ---")

    # Gera o arquivo temporário
    output_path = "output_tts.wav"

    # Executa a geração (usando voz padrão ou speaker clonado se enviado)
    # Speaker referenciado por arquivo .wav se quiser clonar
    tts.tts_to_file(
        text=text,
        file_path=output_path,
        speaker_wav=None, # Aqui podes passar um arquivo .wav de referencia para clonagem
        language=lang
    )

    # Lê o arquivo gerado
    with open(output_path, "rb") as f:
        audio_content = f.read()

    return Response(content=audio_content, media_type="audio/wav")

if __name__ == "__main__":
    print("--- [Rádio GMais] Servidor IA online na porta 5002 ---")
    uvicorn.run(app, host="127.0.0.1", port=5002)
