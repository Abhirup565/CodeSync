FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy the backend folder
COPY backend ./backend

# Move into hocuspocus server directory
WORKDIR /app/backend/hocuspocus

# Install dependencies from backend root
RUN npm install --prefix ../

# Expose WebSocket port
EXPOSE 1234

# Start the server
CMD ["node", "server.js"]
