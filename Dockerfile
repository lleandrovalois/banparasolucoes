FROM nginx:alpine

# Remove configuração padrão do Nginx
RUN rm -rf /etc/nginx/conf.d/* /usr/share/nginx/html/*

# Copia configuração customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia arquivos estáticos da aplicação
COPY index.html /usr/share/nginx/html/
COPY banpara_icon.png /usr/share/nginx/html/
COPY banpara_icon.svg /usr/share/nginx/html/
COPY banpara_logo.png /usr/share/nginx/html/
COPY banpara_logo.svg /usr/share/nginx/html/
COPY banpara_logo_white.png /usr/share/nginx/html/

# Expõe a porta 80
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
