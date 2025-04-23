FROM node:22-alpine
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build \
    && npm prune --production \
    && rm -rf src \
    && rm tsconfig.json \
    && rm package-lock.json

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]