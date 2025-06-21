# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build arguments for dynamic branding
ARG NEXT_PUBLIC_APP_BRAND_PREFIX=VMIS
ARG NEXT_PUBLIC_API_URL=http://localhost:3000

# Set environment variables for build
ENV NEXT_PUBLIC_APP_BRAND_PREFIX=$NEXT_PUBLIC_APP_BRAND_PREFIX
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built application
COPY --from=builder /app/out ./out
COPY --from=builder /app/package.json ./

# Install serve to serve static files
RUN npm install -g serve

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

# Start the application
CMD ["serve", "-s", "out", "-l", "3000"]