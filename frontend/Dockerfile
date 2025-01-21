# --------***********----------
#     Stage 1: Dependencies
# --------***********----------


FROM node:20-slim AS deps
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

WORKDIR /app

# Install dependencies required for node-gyp
RUN apt-get update && \
    apt-get install -y python3 make g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json ./

# Install dependencies with exact versions
RUN npm install --legacy-peer-deps


# --------***********----------
#     Stage 2: Builder
# --------***********----------


FROM node:20-slim AS builder
WORKDIR /app

# Copy dependencies and source code
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Build the application with error handling and skip ESLint
ENV DISABLE_ESLINT_PLUGIN true
RUN SKIP_ESLINT=true npm run build || (cat .next/error.log && exit 1)


# --------***********----------
#     Stage 3: Runner
# --------***********----------


FROM node:20-slim AS runner
LABEL maintainer="Md. Afzal Hassan Ehsani <https://www.linkedin.com/in/iemafzalhassan/>"

WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Add non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the application
CMD ["node", "server.js"]