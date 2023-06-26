# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy all files from the current directory to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose a port that the application listens on
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]
