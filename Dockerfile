FROM node:22-bookworm-slim

# Instala python + curl + Ollama
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv build-essential curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Instala Ollama
RUN curl -fsSL https://ollama.com/install.sh | sh

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 3000

# Só inicia o Ollama em background e roda o Node
CMD ollama serve & npm start
