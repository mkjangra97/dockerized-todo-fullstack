# Stage 1: Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Production Stage
FROM node:20-alpine
WORKDIR /app
# Sirf zaroori files aur modules copy karna
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app ./ 

EXPOSE 5000
CMD ["npm", "start"]