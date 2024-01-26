# feat: Implement Comprehensive Server Setup, Authentication Middleware, and Utility Functions

## 25 Jan 2023

This commit represents a substantial step forward in the development of our application. The introduction of a sophisticated server setup using Express.js brings several key features into play. Notably, the server now incorporates CORS handling, ensuring secure cross-origin resource sharing. Middleware for parsing JSON and URL-encoded data has been integrated, enhancing the server's ability to handle diverse content types seamlessly.

## Authentication Middleware

In addition to the server setup, a comprehensive authentication middleware has been implemented. This middleware plays a pivotal role in securing our application by verifying and decoding user tokens. It extracts tokens from request headers or query parameters and employs the JWT_SECRET from environment variables to ensure token validity. In the case of successful validation, user information is set in the response object for further processing, while invalid tokens result in a 401 status accompanied by an error message. This authentication layer fortifies protected routes, allowing only authenticated users with valid tokens to access them.

## Utility Functions

Furthermore, this commit introduces utility functions that contribute to the overall security and functionality of the application.

- A password hashing function utilizing the SHA-256 algorithm provides a robust method for securing user credentials.
- The admin user signup functionality ensures the creation of unique admin accounts, with secure storage of hashed passwords and the flexibility to customize the admin user's full name.
- Additional utility functions include checking for an existing admin user, creating JSON Web Tokens (JWT), and implementing a Prisma client singleton pattern for efficient database connections.

These implementations collectively lay the groundwork for a secure, modular, and extensible application. The commit not only enhances security but also fosters a maintainable and organized codebase, setting the stage for future development and feature additions.

---
