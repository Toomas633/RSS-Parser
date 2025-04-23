FROM node:22-alpine AS backend
WORKDIR /app

COPY backend/ .

RUN npm ci \
    && npm run build \
    && npm prune --production

FROM node:22-alpine AS production
WORKDIR /app

COPY run.sh .

# Backend
COPY --from=backend /app/node_modules ./node_modules
COPY --from=backend /app/dist ./backend/dist
COPY --from=backend /app/docs ./backend/docs

EXPOSE 3000
ENV NODE_ENV=production

CMD ["sh", "run.sh"]