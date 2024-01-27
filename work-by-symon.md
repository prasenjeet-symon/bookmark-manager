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

# Work Completed: Application Feature Implementations and Enhancements

## 26 Jan 2023

## UserSetting Prisma Model
- Implemented the `UserSetting` Prisma model, capturing user-specific settings such as dark mode, number of columns, and more.
- Designed the model with structured fields, contributing to a personalized user experience.

## UserTab Prisma Model
- Introduced the `UserTab` Prisma model, allowing users to create and customize individual tabs within the application.
- Established a relation to associate each tab with a specific user, enhancing content organization.

## Category Prisma Model
- Implemented the `Category` Prisma model, representing categories within the application for organizing content.
- Established relationships with the `UserTab` model to maintain data consistency and flexibility.

## Link Prisma Model
- Introduced the `Link` Prisma model, facilitating the organization and management of individual links within the application.
- Established relationships with the `Category` model for structured content representation.

## Tag and HiddenTag Prisma Models
- Implemented the `Tag` and `HiddenTag` Prisma models, providing a robust mechanism for categorizing and managing links with user-defined tags and hidden tags.
- Established many-to-many relationships with the `Link` model for effective content organization.

## User Authentication Functionality
- Implemented user signup, login, forgot password, and password reset functionalities.
- Enhanced security through password hashing, JWT generation, and email validation.
- Enabled users to securely create accounts, log in, and recover passwords.

## Google Sign-In and Sign-Up
- Implemented Google Sign-In and Sign-Up functionalities for enhanced user authentication.
- Validated Google authentication tokens and created JWTs for secure user sessions.

## Token Validity Check
- Implemented a route to check the validity of provided tokens.
- Enhanced security by allowing clients to verify token validity before sensitive operations.

## User Settings Management
- Implemented routes for retrieving and updating user settings.
- Enhanced the user experience by providing personalized configurations.

## User Tabs Management
- Implemented routes for retrieving, adding, and updating user tabs.
- Improved content organization and customization for users.

These features collectively lay the groundwork for a secure, modular, and user-friendly application. The commit not only focuses on enhancing security but also contributes to a more organized and personalized user experience. The implemented functionalities provide a strong foundation for future development and user-centric feature additions.