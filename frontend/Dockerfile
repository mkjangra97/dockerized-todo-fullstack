FROM node:22-alpine AS Builder
WORKDIR /app
COPY package*.json ./
RUN npm install --network-timeout=100000 --prefer-offline --no-audit
COPY . .
RUN npm run build

# Nginx Setup
FROM nginx:stable-alpine
COPY --from=Builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
