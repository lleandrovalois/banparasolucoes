#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  Deploy Banpará - Portal de Soluções e Atendimento"
echo "  Domínio: banparasolucoes.klynner.com.br"
echo "=========================================================="

# 1. Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "[+] Instalando Docker no Ubuntu 24.04..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo systemctl enable --now docker
fi

# 2. Build e Deploy com Docker Compose
echo "[+] Construindo e subindo os containers..."
docker compose down || true
docker compose up -d --build

echo "[+] Status do container:"
docker compose ps

echo "=========================================================="
echo "  Deploy concluído com sucesso!"
echo "  Acesse: http://banparasolucoes.klynner.com.br"
echo "=========================================================="
