# --- Stage 1: Build the React App ---
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies install karna
COPY package*.json ./
RUN npm install

# Code copy aur Build banana
COPY . .
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]