# development stage
FROM node:14.18.2-alpine AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY prisma ./

RUN npx prisma generate
# PS: run the database migrations, remove if service has no database
RUN yarn run migrate:prod

COPY . .

RUN yarn build

# production stage
FROM node:14.18.2-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --production

COPY --from=development /usr/src/app/node_modules ./node_modules
COPY --from=development /usr/src/app/package*.json ./
COPY --from=development /usr/src/app/dist ./dist
COPY prisma ./

CMD ["node", "dist/main"]
