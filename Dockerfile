# ==========================================
# Stage 1: Build & Assets Compilation Stage
# ==========================================
# We use the official Playwright image which already contains the browser binaries!
FROM mcr.microsoft.com/playwright:v1.59.1-noble AS builder

# Install curl to download yt-dlp
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Download latest yt-dlp binary
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app

# Copy package manifests first for optimal layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy configuration and source files to build the TS project
COPY tsconfig.json ./
COPY src/ ./src
RUN npm run build

# ==========================================
# Stage 2: Minimal Runtime Production Image
# ==========================================
FROM node:24-slim

# Install core runtime necessities:
# - python3 (Required to execute yt-dlp)
# - ffmpeg (Required for Discord audio streaming)
# - dumb-init (Proper process supervision/signal handling)
# - Chromium system libraries (Required by Playwright to run headless Chrome)
RUN apt-get update && apt-get install -y \
    python3 \
    ffmpeg \
    dumb-init \
    libglib2.0-0 libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libdbus-1-3 libxcb1 libxkbcommon0 libx11-6 libxcomposite1 \
    libxdamage1 libxext6 libxfixes3 libxrandr2 libgbm1 libpango-1.0-0 \
    libcairo2 libasound2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install production-only dependencies (excludes TypeScript/testing frameworks)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled JavaScript files from Stage 1
COPY --from=builder /app/dist ./dist

# Copy downloaded yt-dlp executable from Stage 1
COPY --from=builder /usr/local/bin/yt-dlp /usr/local/bin/yt-dlp

# Copy pre-baked Playwright browser binaries directly from Stage 1
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
COPY --from=builder /ms-playwright /ms-playwright

# Create required scratch space directory for game torrent downloads
RUN mkdir downloads

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "start"]