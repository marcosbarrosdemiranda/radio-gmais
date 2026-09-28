FROM python:3.10-slim

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    build-essential \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar requirements
COPY requirements_ia.txt .

# Atualizar pip antes de instalar
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Instalar dependências (o Docker no Linux lida melhor com a compilação de pacotes nativos)
RUN pip install --no-cache-dir -r requirements_ia.txt

# Copiar o restante do código
COPY . .

# Expõe a porta do servidor de IA
EXPOSE 5002

CMD ["python", "server_xtts.py"]
