
# WhatsApp Messaging Service Documentation

## Overview

This project implements a messaging service using the WhatsApp Web API, RabbitMQ for message queuing, and Express.js for the API framework. The service allows sending messages to WhatsApp numbers by publishing messages to a RabbitMQ queue and consuming them.

## Technologies Used

- **Node.js**: JavaScript runtime environment
- **Express.js**: Web framework for building APIs
- **RabbitMQ**: Message broker for queuing messages
- **WhatsApp Web API**: API for sending messages via WhatsApp
- **Swagger**: API documentation tool

## Project Structure

```
.
├── src
│   ├── app.js                    # Express app configuration
│   ├── controllers
│   │   └── messageController.js  # Controller for handling messages
│   ├── docs
│   │   └── swagger.js            # Swagger documentation configuration
│   ├── middlewares
│   │   └── errorMiddleware.js     # Error handling middleware
│   ├── routes
│   │   └── messageRoutes.js      # Routes for message API
│   ├── services
│   │   ├── MessageConsumer.js     # RabbitMQ consumer for messages
│   │   ├── MessageProducer.js      # RabbitMQ producer for sending messages
│   │   └── WhatsAppClient.js      # Client for WhatsApp API interactions
│   └── index.js                  # Entry point for the application
├── .env                           # Environment variables
├── package.json                   # Project dependencies
├── tsconfig.json                  # TypeScript configuration
└── README.md                      # Project documentation
```

## API Endpoints

### Send Message

- **POST** `/api/messages/send`
- **Description**: Sends a message to RabbitMQ for delivery via WhatsApp.
- **Request Body**:
  ```json
  {
    "phoneNumber": "+550012345678",
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

4. Create a `.env` file in the root directory and define the following variables:
   ```plaintext
   RABBIT_HOST=your_rabbit_host
   RABBIT_PORT=your_rabbit_port
   RABBIT_USERNAME=your_rabbit_username
   RABBIT_PASSWORD=your_rabbit_password
   API_PORT=3000
   ```

5. Start the application:
   ```bash
   npm start
   ```

## Error Handling

The application uses a custom error handling middleware that responds with a structured error object. Errors are logged to the console for debugging purposes.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.
