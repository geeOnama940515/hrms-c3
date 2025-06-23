# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Static environment values
ENV NEXT_PUBLIC_APP_BRAND_PREFIX=VMIS-HRMS
ENV NEXT_PUBLIC_API_URL=http://localhost:5566

# Build the app
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Copy built app
COPY --from=builder /app/out ./out
COPY --from=builder /app/package.json ./

# Serve static files
RUN npm install -g serve

# Use non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1

CMD ["serve", "-s", "out", "-l", "3000"]
