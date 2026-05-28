#!/bin/sh

# Esperar a que la base de datos esté lista
echo "Esperando a que la base de datos esté disponible..."

# Esperamos a que la conexión de red se establezca bien
sleep 5

# Aplicar las migraciones a la base de datos (crear las tablas)
echo "Aplicando migraciones..."
npx prisma db push --accept-data-loss

# Ejecutar el script de semilla (llenar con datos iniciales)
echo "Llenando la base de datos con datos iniciales..."
npx prisma db seed

# Iniciar el servidor
echo "Iniciando el servidor Express..."
npm start
