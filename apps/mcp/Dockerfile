FROM node:22-alpine
WORKDIR /app
COPY apps/mcp/package.json ./package.json
RUN npm install --omit=dev
COPY apps/mcp/server.js ./server.js
COPY apps/mcp/public ./public
ENV NODE_ENV=production
EXPOSE 10000
CMD ["npm", "start"]
