#!/bin/bash

# Script para detener la aplicación SDGPYT Backend

set -e

# Variables
APP_NAME="sdgpyt-backend"
DEPLOY_DIR="/home/ec2-user/sdgpyt"
PID_FILE="${DEPLOY_DIR}/${APP_NAME}.pid"

echo "==================================="
echo "Deteniendo ${APP_NAME}"
echo "==================================="

if [ ! -f ${PID_FILE} ]; then
    echo "No se encuentra el archivo PID. La aplicación podría no estar corriendo."
    exit 0
fi

PID=$(cat ${PID_FILE})

if ps -p ${PID} > /dev/null 2>&1; then
    echo "Deteniendo aplicación con PID: ${PID}"
    kill ${PID}

    # Esperar a que el proceso termine
    for i in {1..30}; do
        if ! ps -p ${PID} > /dev/null 2>&1; then
            echo "Aplicación detenida correctamente"
            rm -f ${PID_FILE}
            exit 0
        fi
        echo "Esperando... (${i}/30)"
        sleep 1
    done

    # Si todavía está corriendo, forzar detención
    if ps -p ${PID} > /dev/null 2>&1; then
        echo "Forzando detención..."
        kill -9 ${PID}
        sleep 2
    fi

    rm -f ${PID_FILE}
    echo "Aplicación detenida"
else
    echo "El proceso con PID ${PID} no está corriendo"
    rm -f ${PID_FILE}
fi
