# Scripts de Deployment - SDGPYT Backend

Scripts de administración para el backend de SDGPYT en servidores EC2.

## Scripts Disponibles

### deploy.sh

Script principal de deployment que:
- Detiene la aplicación actual si está corriendo
- Hace backup del JAR anterior
- Inicia la nueva versión de la aplicación
- Verifica que la aplicación haya iniciado correctamente

**Uso:**
```bash
./deploy.sh
```

**Prerequisitos:**
- Archivo JAR en el directorio de deployment
- Archivo `application-prod.properties` configurado
- Variables de entorno configuradas

**Ubicación de archivos:**
- JAR: `/home/ec2-user/sdgpyt/backend-0.0.1-SNAPSHOT.jar`
- Config: `/home/ec2-user/sdgpyt/application-prod.properties`
- PID: `/home/ec2-user/sdgpyt/sdgpyt-backend.pid`
- Logs: `/home/ec2-user/sdgpyt/logs/application.log`

### stop.sh

Detiene la aplicación de forma segura.

**Uso:**
```bash
./stop.sh
```

**Comportamiento:**
1. Envía señal SIGTERM al proceso (detención graceful)
2. Espera hasta 30 segundos para que termine
3. Si no termina, envía SIGKILL (forzar)
4. Elimina el archivo PID

### status.sh

Muestra el estado actual de la aplicación.

**Uso:**
```bash
./status.sh
```

**Información mostrada:**
- Estado: CORRIENDO o DETENIDO
- PID del proceso
- Uso de memoria y CPU
- Tiempo de ejecución
- Últimas 20 líneas de logs

## Configuración Inicial

### 1. Copiar Scripts a EC2

```bash
# Desde tu máquina local
scp -i tu-clave.pem scripts/*.sh ec2-user@tu-ec2-ip:/home/ec2-user/sdgpyt/
```

### 2. Dar Permisos de Ejecución

```bash
# En EC2
ssh -i tu-clave.pem ec2-user@tu-ec2-ip
cd /home/ec2-user/sdgpyt
chmod +x *.sh
```

### 3. Configurar Variables de Entorno

Editar `~/.bashrc` y agregar:

```bash
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=jira
export DB_USER=root
export DB_PASSWORD=tu_password
export JWT_SECRET=tu_jwt_secret
export EMAIL_USERNAME=tu_email@gmail.com
export EMAIL_PASSWORD=tu_app_password
export API_URL=http://tu-ec2-ip:8080
export CORS_ORIGINS=http://tu-frontend-url
```

Aplicar cambios:
```bash
source ~/.bashrc
```

## Estructura de Directorios

```
/home/ec2-user/sdgpyt/
├── backend-0.0.1-SNAPSHOT.jar      # Aplicación
├── application-prod.properties      # Configuración
├── sdgpyt-backend.pid              # Archivo PID
├── deploy.sh                        # Script de deployment
├── stop.sh                          # Script de detención
├── status.sh                        # Script de estado
├── logs/                           # Directorio de logs
│   └── application.log             # Log de la aplicación
└── backup/                         # Backups de versiones anteriores
    └── backend-*.jar.backup.*      # JAR backups con timestamp
```

## Comandos Comunes

### Desplegar Nueva Versión

```bash
# Automático (desde Jenkins)
# El pipeline ejecuta todo automáticamente

# Manual
cd /home/ec2-user/sdgpyt
./deploy.sh
```

### Verificar Estado

```bash
./status.sh
```

### Reiniciar Aplicación

```bash
./stop.sh && ./deploy.sh
```

### Ver Logs en Tiempo Real

```bash
tail -f /home/ec2-user/sdgpyt/logs/application.log
```

### Filtrar Errores en Logs

```bash
grep -i error /home/ec2-user/sdgpyt/logs/application.log
grep -i exception /home/ec2-user/sdgpyt/logs/application.log
```

### Restaurar Backup

```bash
cd /home/ec2-user/sdgpyt/backup
ls -lt  # Ver backups disponibles
cp backend-0.0.1-SNAPSHOT.jar.backup.20231201_143022 ../backend-0.0.1-SNAPSHOT.jar
cd ..
./deploy.sh
```

## Solución de Problemas

### La Aplicación No Inicia

```bash
# Ver logs completos
cat /home/ec2-user/sdgpyt/logs/application.log

# Verificar que el JAR existe
ls -lh /home/ec2-user/sdgpyt/backend-0.0.1-SNAPSHOT.jar

# Verificar variables de entorno
env | grep -E 'DB_|JWT_|EMAIL_'

# Probar manualmente
java -jar /home/ec2-user/sdgpyt/backend-0.0.1-SNAPSHOT.jar
```

### Puerto 8080 Ocupado

```bash
# Ver qué proceso usa el puerto
sudo netstat -tlnp | grep 8080
# o
sudo lsof -i :8080

# Matar el proceso
sudo kill -9 <PID>
```

### Proceso Zombie

```bash
# Buscar proceso
ps aux | grep java

# Forzar detención
sudo kill -9 <PID>

# Limpiar archivo PID
rm -f /home/ec2-user/sdgpyt/sdgpyt-backend.pid
```

### Sin Espacio en Disco

```bash
# Ver uso de disco
df -h

# Limpiar logs antiguos
cd /home/ec2-user/sdgpyt/logs
rm -f *.log.* # logs rotados

# Limpiar backups antiguos (más de 7 días)
cd /home/ec2-user/sdgpyt/backup
find . -name "*.backup.*" -mtime +7 -delete
```

## Logs y Monitoreo

### Configurar Logrotate

Crear `/etc/logrotate.d/sdgpyt`:

```bash
sudo nano /etc/logrotate.d/sdgpyt
```

Contenido:
```
/home/ec2-user/sdgpyt/logs/*.log {
    daily
    rotate 7
    compress
    missingok
    notifempty
    create 0644 ec2-user ec2-user
    postrotate
        # Opcional: reiniciar la app para que use el nuevo archivo
        # /home/ec2-user/sdgpyt/stop.sh && /home/ec2-user/sdgpyt/deploy.sh
    endscript
}
```

### Configurar Servicio Systemd (Opcional)

Crear `/etc/systemd/system/sdgpyt.service`:

```ini
[Unit]
Description=SDGPYT Backend Service
After=network.target postgresql.service

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/home/ec2-user/sdgpyt
ExecStart=/usr/bin/java -jar -Xms512m -Xmx1024m -Dspring.profiles.active=prod -Dspring.config.location=file:/home/ec2-user/sdgpyt/application-prod.properties /home/ec2-user/sdgpyt/backend-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
StandardOutput=append:/home/ec2-user/sdgpyt/logs/application.log
StandardError=append:/home/ec2-user/sdgpyt/logs/application.log

[Install]
WantedBy=multi-user.target
```

Habilitar servicio:
```bash
sudo systemctl daemon-reload
sudo systemctl enable sdgpyt
sudo systemctl start sdgpyt
sudo systemctl status sdgpyt
```

## Mejoras Futuras

- Agregar health check automático cada 5 minutos
- Implementar alertas por email o Slack en caso de caída
- Agregar métricas con Prometheus
- Implementar rolling deployment
- Agregar validación de schema de base de datos pre-deployment

## Notas Importantes

- Los scripts asumen que el usuario es `ec2-user`. Ajusta según tu sistema.
- Las rutas están hardcoded a `/home/ec2-user/sdgpyt`. Modifica si usas otra ubicación.
- Los backups se acumulan. Considera limpiar backups antiguos periódicamente.
- El script de deployment espera 5 segundos después de iniciar la app. Ajusta según tu tiempo de inicio.
