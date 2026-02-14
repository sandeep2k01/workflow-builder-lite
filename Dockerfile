FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine
WORKDIR /app

# Backend
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./

# Copy built frontend
COPY --from=frontend-build /app/frontend/dist ./public

# Serve frontend static files from Express in production
ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["node", "server.js"]
