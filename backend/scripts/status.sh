#!/bin/bash

# Script para verificar el estado de la aplicación SDGPYT Backend

# Variables
APP_NAME="sdgpyt-backend"
DEPLOY_DIR="/home/ec2-user/sdgpyt"
PID_FILE="${DEPLOY_DIR}/${APP_NAME}.pid"
LOG_FILE="${DEPLOY_DIR}/logs/application.log"

echo "==================================="
echo "Estado de ${APP_NAME}"
echo "==================================="

if [ ! -f ${PID_FILE} ]; then
    echo "Estado: DETENIDO (no se encuentra archivo PID)"
    exit 0
fi

PID=$(cat ${PID_FILE})

if ps -p ${PID} > /dev/null 2>&1; then
    echo "Estado: CORRIENDO"
    echo "PID: ${PID}"
    echo ""
    echo "Información del proceso:"
    ps -p ${PID} -o pid,ppid,cmd,%mem,%cpu,etime

    echo ""
    echo "Uso de memoria:"
    ps -p ${PID} -o pid,vsz,rss,pmem

    echo ""
    echo "Últimas 20 líneas del log:"
    echo "-----------------------------------"
    if [ -f ${LOG_FILE} ]; then
        tail -20 ${LOG_FILE}
    else
        echo "No se encuentra el archivo de logs"
    fi

    echo ""
    echo "Para ver logs en tiempo real:"
    echo "  tail -f ${LOG_FILE}"
else
    echo "Estado: DETENIDO (el proceso ${PID} no está corriendo)"
    rm -f ${PID_FILE}
fi
