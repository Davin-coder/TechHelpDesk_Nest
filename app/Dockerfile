FROM node:20-alpine AS build

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:20-alpine AS runner

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]