# Usamos la imagen oficial de Node como base
FROM node:20-alpine

# Instalamos openssl necesario para el motor de Prisma en Alpine
RUN apk add --no-cache openssl

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código del servidor
COPY . .

# Generamos el cliente de Prisma
RUN npx prisma generate

# Damos permisos de ejecución al script de arranque
RUN chmod +x start.sh

# Exponemos el puerto de Express
EXPOSE 8080

# Comando para iniciar el servidor usando el script automatizado
CMD ["./start.sh"]
