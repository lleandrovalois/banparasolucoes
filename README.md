# Banpará - Portal de Soluções e Atendimento

Protótipo interativo e moderno do portal de atendimento e soluções Banpará.

---

## 🚀 Como Hospedar no VPS Hostinger (Ubuntu 24.04)

### 📌 Dados do Servidor
- **IP do VPS:** `177.7.60.189`
- **Domínio:** `banparasolucoes.klynner.com.br`
- **Ambiente:** Ubuntu 24.04 LTS com Docker

---

### Passo 1: Configurar a Zona de DNS
No painel do seu domínio (`klynner.com.br` no Cloudflare, Registro.br ou Hostinger):
1. Crie uma entrada do tipo **A**:
   - **Nome / Host:** `banparasolucoes`
   - **Tipo:** `A`
   - **Destino / IP:** `177.7.60.189`
   - **TTL:** Automático ou 300s

---

### Passo 2: Acessar o VPS via SSH
No seu terminal local (PowerShell ou Bash):
```bash
ssh root@177.7.60.189
```

---

### Passo 3: Clonar o Repositório no VPS
```bash
# Clone o repositório
git clone https://github.com/lleandrovalois/banparasolucoes.git

# Acesse a pasta do projeto
cd banparasolucoes
```

---

### Passo 4: Executar o Deploy com Docker
Execute o script automático que prepara o Docker e sobe o container:
```bash
chmod +x deploy.sh
./deploy.sh
```

Ou manualmente com Docker Compose:
```bash
docker compose up -d --build
```

O container iniciará na porta `80`.

---

### Passo 5: Configurar SSL / HTTPS Gratuito (Let's Encrypt)

Se o VPS já possui um Nginx no host ou Nginx Proxy Manager / Traefik:
- Aponte o proxy para `http://localhost:80` (ou altere a porta no `docker-compose.yml` se a porta 80 já estiver em uso, ex: `8080:80`).

Para configurar SSL direto no host com Nginx e Certbot:
```bash
# 1. Instalar Nginx e Certbot se desejar terminação SSL no host
sudo apt update
sudo apt install -y certbot python3-certbot-nginx
```

---

## 💻 Como Rodar Localmente

### Opção 1: Com Node.js
```bash
npm start
# Acesse http://localhost:3000
```

### Opção 2: Com Docker
```bash
docker compose up -d --build
# Acesse http://localhost:80
```
