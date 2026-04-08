#!/bin/bash

# Script de configuración inicial para EC2
# Ejecutar este script en tu instancia EC2 después de crearla
# Uso: ./setup-ec2.sh

set -e

echo "========================================="
echo "Configuración Inicial de EC2 para SDGPYT"
echo "========================================="
echo ""

# Detectar el sistema operativo
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$ID
else
    echo "No se pudo detectar el sistema operativo"
    exit 1
fi

echo "Sistema operativo detectado: $OS"
echo ""

# Actualizar sistema
echo "1. Actualizando sistema..."
if [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ]; then
    sudo yum update -y
elif [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt update && sudo apt upgrade -y
fi
echo "Sistema actualizado"
echo ""

# Instalar Java 21
echo "2. Instalando Java 21..."
if [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ]; then
    sudo yum install java-21-amazon-corretto-devel -y
elif [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt install openjdk-21-jdk -y
fi

java -version
echo "Java 21 instalado correctamente"
echo ""

# Instalar PostgreSQL (opcional - comentado por defecto)
# Descomenta si quieres PostgreSQL local
# echo "3. Instalando PostgreSQL..."
# if [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ]; then
#     sudo yum install postgresql15-server postgresql15 -y
#     sudo postgresql-setup initdb
#     sudo systemctl start postgresql
#     sudo systemctl enable postgresql
# elif [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
#     sudo apt install postgresql postgresql-contrib -y
#     sudo systemctl start postgresql
#     sudo systemctl enable postgresql
# fi
# echo "PostgreSQL instalado"
# echo ""

# Instalar herramientas útiles
echo "3. Instalando herramientas útiles..."
if [ "$OS" = "amzn" ] || [ "$OS" = "rhel" ]; then
    sudo yum install git curl wget htop -y
elif [ "$OS" = "ubuntu" ] || [ "$OS" = "debian" ]; then
    sudo apt install git curl wget htop -y
fi
echo "Herramientas instaladas"
echo ""

# Crear directorios de la aplicación
echo "4. Creando estructura de directorios..."
DEPLOY_DIR="${HOME}/sdgpyt"
mkdir -p ${DEPLOY_DIR}/logs
mkdir -p ${DEPLOY_DIR}/backup
chmod 755 ${DEPLOY_DIR}
echo "Directorios creados en: ${DEPLOY_DIR}"
echo ""

# Configurar firewall
echo "5. Configurando firewall..."
if command -v firewall-cmd &> /dev/null; then
    echo "Configurando firewalld..."
    sudo firewall-cmd --permanent --add-port=8080/tcp || true
    sudo firewall-cmd --reload || true
elif command -v ufw &> /dev/null; then
    echo "Configurando UFW..."
    sudo ufw allow 8080/tcp || true
    sudo ufw --force enable || true
else
    echo "No se encontró firewall, saltando configuración"
fi
echo "Firewall configurado"
echo ""

# Crear archivo de variables de entorno
echo "6. Creando archivo de variables de entorno..."
cat > ${DEPLOY_DIR}/.env << 'EOF'
# Variables de entorno para SDGPYT Backend
# IMPORTANTE: Configura estos valores antes de iniciar la aplicación

# Database Configuration
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=jira
export DB_USER=root
export DB_PASSWORD=CHANGE_ME

# JWT Configuration
export JWT_SECRET=CHANGE_ME_MIN_256_BITS
export JWT_EXPIRATION=86400

# Email Configuration
export EMAIL_HOST=smtp.gmail.com
export EMAIL_PORT=587
export EMAIL_USERNAME=CHANGE_ME@gmail.com
export EMAIL_PASSWORD=CHANGE_ME

# API Configuration
export API_URL=http://YOUR_EC2_IP:8080

# CORS Configuration
export CORS_ORIGINS=http://your-frontend-url
EOF

echo "Archivo .env creado en: ${DEPLOY_DIR}/.env"
echo ""

# Agregar source del .env al .bashrc
if ! grep -q "source ${DEPLOY_DIR}/.env" ~/.bashrc; then
    echo "source ${DEPLOY_DIR}/.env" >> ~/.bashrc
    echo "Variables de entorno agregadas a .bashrc"
fi
echo ""

# Crear archivo de servicio systemd (opcional)
echo "7. ¿Deseas crear un servicio systemd para la aplicación? (s/n)"
read -r CREATE_SERVICE

if [ "$CREATE_SERVICE" = "s" ] || [ "$CREATE_SERVICE" = "S" ]; then
    sudo tee /etc/systemd/system/sdgpyt.service > /dev/null << EOF
[Unit]
Description=SDGPYT Backend Service
After=network.target

[Service]
Type=simple
User=${USER}
WorkingDirectory=${DEPLOY_DIR}
EnvironmentFile=${DEPLOY_DIR}/.env
ExecStart=/usr/bin/java -jar -Xms512m -Xmx1024m -Dspring.profiles.active=prod -Dspring.config.location=file:${DEPLOY_DIR}/application-prod.properties ${DEPLOY_DIR}/backend-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:${DEPLOY_DIR}/logs/application.log
StandardError=append:${DEPLOY_DIR}/logs/application.log

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    echo "Servicio systemd creado. Para habilitarlo:"
    echo "  sudo systemctl enable sdgpyt"
    echo "  sudo systemctl start sdgpyt"
fi
echo ""

# Configurar logrotate
echo "8. Configurando logrotate..."
sudo tee /etc/logrotate.d/sdgpyt > /dev/null << EOF
${DEPLOY_DIR}/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0644 ${USER} ${USER}
}
EOF
echo "Logrotate configurado"
echo ""

# Configurar PostgreSQL (si está instalado)
if command -v psql &> /dev/null; then
    echo "9. ¿Deseas configurar la base de datos PostgreSQL local? (s/n)"
    read -r SETUP_DB

    if [ "$SETUP_DB" = "s" ] || [ "$SETUP_DB" = "S" ]; then
        echo "Ingresa el nombre de usuario de la base de datos [root]:"
        read -r DB_USER
        DB_USER=${DB_USER:-root}

        echo "Ingresa la contraseña para el usuario ${DB_USER}:"
        read -s DB_PASSWORD

        sudo -u postgres psql << EOSQL
CREATE DATABASE jira;
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';
GRANT ALL PRIVILEGES ON DATABASE jira TO ${DB_USER};
EOSQL

        echo "Base de datos configurada"

        # Actualizar archivo .env
        sed -i "s/DB_USER=.*/DB_USER=${DB_USER}/" ${DEPLOY_DIR}/.env
        sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=${DB_PASSWORD}/" ${DEPLOY_DIR}/.env
    fi
fi
echo ""

# Mostrar resumen
echo "========================================="
echo "Configuración Completada"
echo "========================================="
echo ""
echo "Pasos siguientes:"
echo ""
echo "1. Editar las variables de entorno:"
echo "   nano ${DEPLOY_DIR}/.env"
echo ""
echo "2. Cargar las variables de entorno:"
echo "   source ${DEPLOY_DIR}/.env"
echo ""
echo "3. Copiar archivos desde Jenkins o manualmente:"
echo "   - backend-0.0.1-SNAPSHOT.jar"
echo "   - application-prod.properties"
echo "   - Scripts: deploy.sh, stop.sh, status.sh"
echo ""
echo "4. Dar permisos a los scripts:"
echo "   chmod +x ${DEPLOY_DIR}/*.sh"
echo ""
echo "5. Ejecutar deployment:"
echo "   ${DEPLOY_DIR}/deploy.sh"
echo ""
echo "Directorios creados:"
echo "  - Deployment: ${DEPLOY_DIR}"
echo "  - Logs:       ${DEPLOY_DIR}/logs"
echo "  - Backups:    ${DEPLOY_DIR}/backup"
echo ""
echo "Variables de entorno: ${DEPLOY_DIR}/.env"
echo ""
echo "IMPORTANTE: Recuerda configurar las variables en el archivo .env"
echo "            antes de iniciar la aplicación."
echo ""
echo "Para ver información del sistema:"
echo "  htop"
echo ""
echo "Para monitorear logs:"
echo "  tail -f ${DEPLOY_DIR}/logs/application.log"
echo ""
