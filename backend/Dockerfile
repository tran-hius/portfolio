FROM node:20-alpine

WORKDIR /app

# Copy package configuration
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 3001

# Start the development server with tsx watch
CMD ["npm", "run", "dev"]
