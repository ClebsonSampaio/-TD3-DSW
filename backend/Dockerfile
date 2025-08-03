FROM node:18 AS build-frontend
WORKDIR /app/frontend
COPY ../frontend/package*.json ./
RUN npm install
COPY ../frontend/ .
RUN npm run build

FROM node:18 AS build-backend
WORKDIR /app
COPY backend/package*.json ./
RUN npm install
COPY backend/ .
COPY --from=build-frontend /app/frontend/dist ./dist/frontend
RUN npm run build

EXPOSE 5000
CMD ["npm", "start"]
