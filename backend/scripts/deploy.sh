#!/bin/bash

# Script de deployment para SDGPYT Backend
# Este script se ejecuta en el servidor EC2

set -e # Detener si hay algún error

# Variables
APP_NAME="sdgpyt-backend"
JAR_NAME="backend-0.0.1-SNAPSHOT.jar"
DEPLOY_DIR="/home/ec2-user/sdgpyt"
PID_FILE="${DEPLOY_DIR}/${APP_NAME}.pid"
LOG_FILE="${DEPLOY_DIR}/logs/application.log"

cd ${DEPLOY_DIR}

echo "==================================="
echo "Iniciando deployment de ${APP_NAME}"
echo "==================================="

# Verificar si la aplicación está corriendo
if [ -f ${PID_FILE} ]; then
    PID=$(cat ${PID_FILE})
    echo "Verificando proceso existente con PID: ${PID}"

    if ps -p ${PID} > /dev/null 2>&1; then
        echo "Deteniendo aplicación existente..."
        kill ${PID}

        # Esperar a que el proceso termine
        for i in {1..30}; do
            if ! ps -p ${PID} > /dev/null 2>&1; then
                echo "Aplicación detenida correctamente"
                break
            fi
            echo "Esperando que el proceso termine... (${i}/30)"
            sleep 1
        done

        # Si todavía está corriendo, forzar detención
        if ps -p ${PID} > /dev/null 2>&1; then
            echo "Forzando detención de la aplicación..."
            kill -9 ${PID}
            sleep 2
        fi
    else
        echo "El proceso con PID ${PID} ya no existe"
    fi

    rm -f ${PID_FILE}
fi

# Verificar que el JAR existe
if [ ! -f "${DEPLOY_DIR}/${JAR_NAME}" ]; then
    echo "Error: No se encuentra el archivo JAR: ${JAR_NAME}"
    exit 1
fi

# Crear directorio de logs si no existe
mkdir -p ${DEPLOY_DIR}/logs

echo "Iniciando nueva instancia de la aplicación..."

# Iniciar la aplicación con el perfil de producción
nohup java -jar \
    -Xms512m \
    -Xmx1024m \
    -Dspring.profiles.active=prod \
    -Dspring.config.location=file:${DEPLOY_DIR}/application-prod.properties \
    ${DEPLOY_DIR}/${JAR_NAME} \
    > ${LOG_FILE} 2>&1 &

# Guardar el PID
echo $! > ${PID_FILE}

echo "Aplicación iniciada con PID: $(cat ${PID_FILE})"

# Esperar y verificar que la aplicación inició correctamente
echo "Verificando inicio de la aplicación..."
sleep 5

if ps -p $(cat ${PID_FILE}) > /dev/null 2>&1; then
    echo "==================================="
    echo "Deployment completado exitosamente!"
    echo "==================================="
    echo "PID: $(cat ${PID_FILE})"
    echo "Logs: ${LOG_FILE}"
    echo ""
    echo "Para ver los logs en tiempo real:"
    echo "  tail -f ${LOG_FILE}"
else
    echo "==================================="
    echo "Error: La aplicación no pudo iniciarse"
    echo "==================================="
    echo "Revisa los logs en: ${LOG_FILE}"
    exit 1
fi
