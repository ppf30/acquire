# Imagen base
FROM node:22-slim

# Carpeta de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar sólo package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar sólo dependencias necesarias para producción
RUN npm install --production

# Copiar todo el código del servicio acquire al contenedor
COPY . .

# Exponer el puerto interno usado por acquire
EXPOSE 3001

# Comando para arrancar el servidor
CMD ["node", "server.js"]
