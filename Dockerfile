FROM node:22-bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv build-essential curl \
    && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://ollama.com/install.sh | sh

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev    # ← mudou aqui (funciona sem package-lock)

COPY . .

# Baixa o modelo pequeno
RUN ollama pull llama3.2:1b

EXPOSE 3000

CMD ollama serve & npm start
