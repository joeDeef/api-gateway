# ETAPA 1: Construcción (Build)
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos archivos de configuración de dependencias
COPY package*.json ./
RUN npm install

# Copiamos el código fuente y compilamos
COPY . .
RUN npm run build

# ETAPA 2: Ejecución (Production)
FROM node:20-alpine AS runner

WORKDIR /app

# Copiamos solo lo necesario para ejecutar la app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Railway inyecta automáticamente la variable PORT, 
# pero exponemos el 3000 por estándar local.
EXPOSE 3000

# Comando para arrancar el Gateway
CMD ["node", "dist/main"]