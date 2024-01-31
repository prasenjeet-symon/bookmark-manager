# feat: Implement Comprehensive Server Setup, Authentication Middleware, and Utility Functions

## 25 Jan 2024

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

## 26 Jan 2024

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

---

# Work completed: Application Feature Implementations and Enhancements

## 27 Jan 2024

### **Implement Google Sign-Up Functionality:**
   - Introduces a new route ("/google-signup") and a method in the Google class for handling Google Sign-Up requests.
   - The controller validates the request body, verifies the Google authentication token, and creates a new user if not already existing.
   - Proper error handling is implemented for invalid tokens or existing users with corresponding credentials.

### **Implement Google Sign-In Functionality:**
   - Introduces a new route ("/google-signin") and a method in the Google class for handling Google Sign-In requests.
   - The controller validates the request body, verifies the Google authentication token, and creates a JWT for existing users.
   - Proper error handling ensures a robust Google Sign-In process using axios to interact with Google's authentication endpoints.

### **Implement Password Reset Functionality:**
   - Introduces a new route ("/reset-password") and a method in the SignupController class for handling password resets.
   - The controller validates the request body, verifies the token's validity and expiration, and updates the user's password in the database.
   - Proper error handling for user not found, token expiration, or decoding errors.

### **Implement Forgot Password Functionality:**
   - Introduces a new route ("/forgot-password") and a method in the SignupController class for handling forgot password functionality.
   - Validates the request body, generates a temporary token for password reset, and sends it to the user via email.
   - Includes proper error handling and validation for a secure and user-friendly forgot password process.

### **Implement User Login Functionality with Email and Password:**
   - Introduces a login route ("/login") and a login method in the SignupController class for handling user login requests.
   - Validates the request body, checks for the existence of a user with the provided email, and verifies the password against the hashed password in the database.
   - Generates a JWT for authentication with appropriate error handling and success logging.

### **Implement User Signup Functionality with Email and Password:**
   - Introduces a signup route ("/signup") and a SignupController class for handling user signup requests.
   - Validates the request body, checks for existing users with the same email, and creates a new user with hashed passwords.
   - Generates a JWT for authentication and includes email and password validation functions.

### **Add Tag and HiddenTag Prisma Models:**
   - Introduces Tag and HiddenTag Prisma models for organizing links with many-to-many relationships.
   - Enhances the database structure for categorizing and managing links based on user-defined tags and hidden tags.

### **Add Link Prisma Model:**
   - Introduces the Link Prisma model representing individual links with fields such as id, title, url, order, icon, notes, categoryId, createdAt, updatedAt, and isDeleted.
   - Establishes relationships with the Category model for structured content organization.

### **Add Category Prisma Model:**
   - Introduces the Category Prisma model representing categories within the application.
   - Includes fields for name, order, color, icon, tabId, createdAt, updatedAt, and isDeleted.
   - Establishes relationships with the UserTab model for organizing content within tabs.

These changes collectively enhance the application's functionality, providing a secure and structured experience for users in managing authentication and content organization.

---

# Work completed: Application Feature Implementations and Enhancements

## 28 Jan 2024

## Authentication and User Tabs Management

### 1. **Tab Deletion Functionality**
   - Implemented a new route ("/tabs") and a method in the TabController class for deleting an existing tab.
   - Controller validates the request body, ensuring the required identifier is present, and soft-deletes the corresponding tab in the database.
   - Enhances user control by allowing removal of unwanted or obsolete tabs, with soft-deletion for potential recovery or auditing purposes.
   - Proper validation prevents unauthorized or incomplete deletion attempts for a secure user experience.

### 2. **Tab Update Functionality**
   - Introduced a new route ("/tabs") and a method in the TabController class for updating an existing tab.
   - Controller validates the request body, extracts necessary data (identifier, name, and order), and updates the corresponding tab in the database.
   - Proper validation ensures required fields are present and meet specified criteria, allowing users to dynamically modify tab names and orders.
   - Enhances user experience by providing dynamic updates to tabs for improved flexibility.

### 3. **Addition of New Tab**
   - Implemented a new route ("/tabs") and a method in the TabController class for adding a new tab.
   - Controller validates the request body, extracts necessary data, and creates a new tab in the database.
   - Proper validation ensures required fields (name and order) are present and meet specified criteria.
   - Enables users to dynamically add tabs, enhancing organization and customization of content within the application.

### 4. **User Tabs Retrieval**
   - Introduced a new route ("/tabs") and a method in the TabController class for retrieving user tabs.
   - Controller uses the authenticated user's email to fetch corresponding tabs from the database and sends them as a response to the client.
   - Proper error handling for cases where the user is not found.
   - Allows clients to retrieve and display tabs associated with a specific user for a customized view of content organization.

## User Settings Management

### 5. **User Settings Update**
   - Implemented a new route ("/user-setting") and a method in the UserSetting class for updating user settings.
   - Controller validates the request body, extracts necessary data, and updates user settings in the database for the authenticated user.
   - Proper validation ensures all required fields are present in the request body.
   - Enables users to customize their settings for a more personalized experience within the application.

### 6. **User Settings Retrieval**
   - Introduced a new route ("/user-setting") and a method in the UserSetting class for retrieving user settings.
   - Controller uses the authenticated user's email to fetch corresponding user settings from the database and sends them as a response to the client.
   - Proper error handling for cases where the user is not found.
   - Allows clients to retrieve and display user-specific settings for a personalized configuration.

## Authentication System Enhancement

### 7. **Token Validity Check**
   - Implemented a new route ("/is-token-valid") and a method in the SignupController class to check the validity of a provided token.
   - Controller validates the request body, checks if the token is expired using the isTokenExpired function, and responds accordingly.
   - Proper error handling, returning an error response when the token is expired.
   - Allows clients to verify the validity of a token before performing sensitive operations, enhancing the security of the authentication system.

   ---

   