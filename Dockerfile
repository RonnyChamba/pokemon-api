FROM node:18

# Create app directory
WORKDIR /app

# Copy app source code
# COPY . /app/

# Copy all files from current directory to working directory in image
COPY . .

# Install app dependencies
RUN npm install

EXPOSE 3000

CMD [ "node", "server.js" ]