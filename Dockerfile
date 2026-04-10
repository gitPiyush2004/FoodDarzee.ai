FROM node:18-alpine

WORKDIR /app

# Copy all repository files into Docker /app workspace
COPY . .

# Install dependencies strictly
RUN npm ci

# Build the Next.js production code
RUN npm run build

# Next.js by default runs on 3000, but Cloud Run expects the PORT variable
ENV PORT 8080
ENV HOST 0.0.0.0
EXPOSE 8080

# Start it up
CMD ["npm", "start"]
