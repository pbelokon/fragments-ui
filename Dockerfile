################################################## 1 

FROM node:18.16.0-alpine AS dependencies

LABEL maintainer="Pavel Belokon <pbelokon@example.com>"
LABEL description="Fragments node.js microservice"

ENV NODE_ENV=production

ENV PORT=1234

WORKDIR /app

COPY package.json package-lock.json ./

# only install production dependencies
RUN npm ci --only=production

################################################## 2 

FROM node:18.16.0-alpine AS builder

# Use /app as our working directory
WORKDIR /app

COPY --from=dependencies /app /app

COPY . . 

ENV NPM_CONFIG_LOGLEVEL=warn

ENV NPM_CONFIG_COLOR=false

CMD ["npm", "run", "build"]

################################################## 3 

FROM nginx:stable-alpine  AS  deploy

COPY --from=builder /app/dist/ /usr/share/nginx/html/

EXPOSE 80