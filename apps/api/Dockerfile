FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --omit=dev
COPY tsconfig.json ./
COPY src ./src
RUN npm install --no-save typescript @types/node @types/express @types/cors @types/better-sqlite3
RUN npm run build
ENV NODE_ENV=production
ENV PORT=10000
EXPOSE 10000
CMD ["node","dist/index.js"]