FROM node:18-alpine

WORKDIR /app

# Copy package files from the app directory
COPY app/package.json app/package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code from the app directory
COPY app/ ./

# Build the Next.js application
RUN npm run build

# Expose the port Cloud Run expects
EXPOSE 8080

# Next.js by default runs on 3000, we need to bind to PORT env variable
ENV PORT 8080
ENV HOST 0.0.0.0

# Start the application
CMD ["npm", "start"]
