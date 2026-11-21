FROM node:22-alpine

WORKDIR /app

# Primero solo package*.json: Docker reutiliza esta capa si no cambian las dependencias
COPY package*.json ./
RUN npm install

# Luego el resto del codigo
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]