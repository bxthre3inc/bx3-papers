# Build Stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Final Stage (Bun Edge Server)
FROM oven/bun:alpine
WORKDIR /app

# Ensure shadow package is installed for groupadd/useradd
RUN apk add --no-cache shadow

# Create a non-root user for security
RUN groupadd -g 1001 vpcuser && \
    useradd -u 1001 -g vpcuser -s /bin/sh -m vpcuser

# Copy server files
COPY server/package*.json ./server/
RUN cd server && bun install

COPY server/ ./server/
COPY --from=build /app/dist ./public

# Ensure the app directory is owned by the non-root user
RUN chown -R vpcuser:vpcuser /app

# Expose VPC Edge Port
EXPOSE 3001

# Run as non-root user
USER vpcuser

# Run the Edge Server
WORKDIR /app/server
CMD ["bun", "run", "src/index.ts"]
