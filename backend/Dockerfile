# --------***********----------
#     Stage 1: Dependencies
# --------***********----------

    
FROM node:18-alpine AS deps
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production --ignore-scripts


# --------***********----------
#     Stage 2: Builder
# --------***********----------


FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application (if needed)
RUN npm run build || echo "No build script found"


# --------***********----------
#     Stage 3: Runner
# --------***********----------


FROM node:18-alpine AS runner
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

WORKDIR /app

ENV NODE_ENV production

# Add non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodeapp

# Copy necessary files from builder
COPY --from=builder --chown=nodeapp:nodejs /app/src ./src
COPY --from=builder --chown=nodeapp:nodejs /app/package.json ./
COPY --from=deps --chown=nodeapp:nodejs /app/node_modules ./node_modules

# Create necessary directories and set permissions
RUN mkdir -p /app/logs && \
    chown -R nodeapp:nodejs /app/logs

# Switch to non-root user
USER nodeapp

# Expose port
EXPOSE 4000

# Set healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/health || exit 1

# Start the application
CMD ["node", "src/index.js"]
