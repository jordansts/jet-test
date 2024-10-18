
# Jet Test Documentation

## Overview

This project implements a messaging service using the WhatsApp Web API, RabbitMQ for message queuing, and Express.js for the API framework. The service allows sending messages to WhatsApp numbers by publishing messages to a RabbitMQ queue and consuming them. Additionally, it utilizes BullMQ for managing job queues and Sentry for error logging. All logs are stored in a PostgreSQL database using Prisma for seamless data management.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Typescript**: Superset of JavaScript for building robust applications
- **Express.js**: Web framework for building APIs
- **RabbitMQ**: Message broker for queuing messages
- **BullMQ**:  Library for managing job queues
- **WhatsApp Web API**: API for sending messages via WhatsApp
- **Sentry**: Error tracking and logging service
- **PostgreSQL**: Database for storing logs and message data (managed using Prisma)
- **Swagger**: API documentation tool


## API Endpoints

### Send Message

- **POST** `/api/send-message`
- **Description**: Sends a message to RabbitMQ for delivery via WhatsApp.
- **Request Body**:
  ```json
  {
    "phoneNumber": "+551199999999",
    "messageText": "Send the message text here"
  }
  ```
- **Responses**:
  - **201 Created**: Message successfully sent.
  - **500 Internal Server Error**: Failed to send message.

### Swagger Documentation

API documentation is available at `/swagger`. This documentation provides a visual representation of the API endpoints and their expected request and response formats.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd <project-directory>
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

6. You can use the docker-compose.yml file to create a complete environment for this application:
   ```bash
   docker-compose up -d
   ```

5. Create a `.env` file in the root directory and define the following variables(there's a .env.example, you can just copy and add your changes, the example keeps the docker-compose environment variables):
   ```plaintext
   RABBIT_HOST=your_rabbit_host
   RABBIT_PORT=your_rabbit_port
   RABBIT_USERNAME=your_rabbit_username
   RABBIT_PASSWORD=your_rabbit_password

   REDIS_HOST=your_redis_host  
   REDIS_PORT=your_redis_port

   API_PORT=your_api_port

   DATABASE_URL=your_database_url

   SENTRY_DSN=your_sentry_dsn

   ```

6. Start the application in dev mode:
   ```bash
   npm run dev
   ```

7. Build the application:
   ```bash
   npm run build
   ```

8. Run the application:
   ```bash
   npm run start
   ```

## Error Handling

The application uses a custom error handling middleware that responds with a structured error object. Errors are logged to the console for debugging purposes. Additionally, Sentry is integrated into the application to capture and log errors, providing valuable insights into any issues that occur in production.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
