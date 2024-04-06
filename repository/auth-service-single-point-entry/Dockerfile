FROM node:latest as builder

# Define build arguments for environment variables
ARG VITE_APP_API_AUTH_SERVICE_ADDRESS
ARG VITE_APP_BASE_URL

# Set environment variables during the build process
ENV VITE_APP_API_AUTH_SERVICE_ADDRESS=$VITE_APP_API_AUTH_SERVICE_ADDRESS
ENV VITE_APP_BASE_URL=$VITE_APP_BASE_URL

WORKDIR /app
COPY package*.json ./
COPY yarn.lock ./

RUN yarn install --ignore-engines

COPY . .

RUN yarn build

FROM node:latest

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD [ "yarn", "serve:prod" ]