FROM node:22-alpine

WORKDIR '/var/www/app'

# Copy package files and .npmrc for legacy peer deps
COPY package*.json .npmrc ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Bundle app source
COPY . .

EXPOSE 3000

ENV NODE_ENV=development

# Use Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
