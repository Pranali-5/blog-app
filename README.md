# blog-app

## Backend

The backend is deployed at: [Backend URL](https://blog-app-e7nf.onrender.com/api/blogs)

### How to Run the Backend

1. Clone the repository:
    ```sh
    git clone https://github.com/Pranali-5/blog-app.git
    ```
2. Navigate to the backend directory:
    ```sh
    cd blog-app/backend
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Start the backend server:
    ```sh
    npm start
    ```
### Environment Variables

To run this project, you need to set the following environment variables with your own values:
 ```sh
JWT_SECRET=your_jwt_secret
MONGO_URL=your_mongo_url
PORT=your_port
AWS_S3_BUCKET_NAME=your_aws_s3_bucket_name
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=your_aws_region
  ```
## Frontend

The frontend is deployed at: [Frontend URL](https://blog-app-1-229p.onrender.com/)

### How to Run the Frontend

1. Navigate to the frontend directory:
    ```sh
    cd blog-app/frontend
    ```
2. Install the dependencies:
    ```sh
    yarn install
    ```
3. Start the frontend server:
    ```sh
    yarn dev
    ```

Now, you can access the frontend at `http://localhost:5173` and the backend at `http://localhost:8080`.

## Tech Stack

- **Frontend**: React, Vite, JavaScript, CSS, HTML
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Deployment**: Render

## Uses of This Project

- **Blog Creation**: Users can create, edit, and delete blog posts.
- **User Authentication**: Secure user authentication and authorization.
- **Commenting System**: Users can comment on blog posts (still in development).
- **Responsive Design**: Mobile-friendly user interface.

## Future Improvements

1. **Scalability Enhancements**
   - Implement load balancing to distribute incoming traffic across multiple servers.
   - Use a content delivery network (CDN) to serve static assets faster and reduce server load.
   - Optimize database queries and indexing to handle a larger number of users and data efficiently.
   - Implement horizontal scaling by adding more instances of the application when needed.

2. **Improving Image Storage**
   - Migrate from local disk storage to cloud storage solutions like Amazon S3 or Google Cloud Storage for better scalability and reliability.
   - Implement image compression and optimization techniques to reduce storage space and improve loading times.
   - Use a CDN to serve images, reducing latency and enhancing user experience.

3. **Performance Optimization**
   - Implement server-side caching to reduce the load on the database and improve response times.
   - Use lazy loading for images and other resources to improve page load times.
   - Optimize frontend code by minimizing and bundling JavaScript and CSS files.

4. **Security Enhancements**
   - Implement rate limiting to protect against DDoS attacks.
   - Use environment variables for sensitive configuration data.
   - Regularly update dependencies to patch known vulnerabilities.

5. **Advanced Features**
   - Add AI-based content recommendations to enhance user engagement.
   - Implement a sentiment analysis tool to monitor and analyze user comments.
   - Develop a chatbot for user support and content discovery assistance.
