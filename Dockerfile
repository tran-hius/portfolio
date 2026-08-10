# Development Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose Vite's default development port
EXPOSE 5173

# Start the Vite development server (expose to all network interfaces)
CMD ["npm", "run", "dev", "--", "--host"]
