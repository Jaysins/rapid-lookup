FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files to the working directory
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port that your application will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
