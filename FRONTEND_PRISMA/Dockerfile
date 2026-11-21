FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host es obligatorio: sin el, Vite solo escucha dentro del contenedor
# y no se puede abrir desde el navegador del PC
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]