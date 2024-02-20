# Use the official Node.js 14 image.
FROM node:18

# Set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy the local code to the container's workspace.
COPY . ./

# Expose the backend port
EXPOSE 5000

# Run the application.
CMD [ "npm", "start" ]