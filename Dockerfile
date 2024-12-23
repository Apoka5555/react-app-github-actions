# Step 1: Use Node.js base image
FROM node:18 as build

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Step 4: Install dependencies
RUN npm ci

# Step 5: Copy the entire app to the container
COPY . .

# Step 6: Build the React app
RUN npm run build

# Step 7: Use a lightweight Nginx image for serving static files
FROM nginx:stable-alpine

# Step 8: Copy the built React app to Nginx's HTML directory
COPY --from=build /app/build /usr/share/nginx/html

# Step 9: Expose port 80
EXPOSE 80

# Step 10: Start Nginx
CMD ["nginx", "-g", "daemon off;"]
