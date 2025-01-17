# --------***********----------
#     Stage 1: Dependencies
# --------***********----------
FROM node:18-alpine AS deps

# Add maintainer info
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"
LABEL description="EasyShop Frontend - A Next.js E-commerce Application"
LABEL version="1.0"

WORKDIR /app

# Install dependencies required for node-gyp
RUN apk add --no-cache python3 make g++ libc6-compat

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# --------***********----------
#     Stage 2: Builder
# --------***********----------
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner

# Add maintainer info in final stage as well
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

WORKDIR /app

# Install PM2 globally for process management
RUN npm install -g pm2

# Set environment variables
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy PM2 configuration
COPY ecosystem.config.cjs ./

# Set correct permissions
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1))"

# Start the application using PM2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]