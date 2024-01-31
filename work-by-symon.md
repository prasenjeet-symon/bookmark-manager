# Work Completed: Application Feature Implementations and Enhancements

## 25 Jan 2024

## Comprehensive Server Setup, Authentication Middleware, and Utility Functions

### 1. **Server Setup with Express.js**
   - Implemented a sophisticated server setup using Express.js.
   - Incorporated CORS handling for secure cross-origin resource sharing.
   - Integrated middleware for parsing JSON and URL-encoded data, enhancing the server's content type handling capabilities.

### 2. **Authentication Middleware**
   - Introduced a comprehensive authentication middleware for securing the application.
   - Verifies and decodes user tokens, extracting them from request headers or query parameters.
   - Utilizes JWT_SECRET from environment variables for token validity checks.
   - Sets user information in the response object upon successful validation.
   - Fortifies protected routes, allowing only authenticated users with valid tokens.

### 3. **Utility Functions**
   - Implemented utility functions contributing to application security and functionality.
   - Password hashing function using the SHA-256 algorithm for robust user credential security.
   - Admin user signup functionality ensuring unique admin accounts with secure storage of hashed passwords and customizable full names.
   - Additional utility functions include checking for an existing admin user, creating JSON Web Tokens (JWT), and implementing a Prisma client singleton pattern for efficient database connections.

This commit marks a significant milestone in the development process, addressing crucial aspects of server setup, authentication, and utility functions to ensure a robust and scalable foundation for the application.

---

# Work Completed: Application Feature Implementations and Enhancements

## 26 Jan 2024

## Prisma Model Implementation

### 1. **UserSetting Prisma Model**
   - Implemented the `UserSetting` Prisma model capturing user-specific settings such as dark mode, number of columns, and more.
   - Designed the model with structured fields, contributing to a personalized user experience.

### 2. **UserTab Prisma Model**
   - Introduced the `UserTab` Prisma model, allowing users to create and customize individual tabs within the application.
   - Established a relation to associate each tab with a specific user, enhancing content organization.

### 3. **Category Prisma Model**
   - Implemented the `Category` Prisma model, representing categories within the application for organizing content.
   - Established relationships with the `UserTab` model to maintain data consistency and flexibility.

### 4. **Link Prisma Model**
   - Introduced the `Link` Prisma model, facilitating the organization and management of individual links within the application.
   - Established relationships with the `Category` model for structured content representation.

### 5. **Tag and HiddenTag Prisma Models**
   - Implemented the `Tag` and `HiddenTag` Prisma models, providing a robust mechanism for categorizing and managing links with user-defined tags and hidden tags.
   - Established many-to-many relationships with the `Link` model for effective content organization.

## User Authentication

### 6. **User Authentication Functionality**
   - Implemented user signup, login, forgot password, and password reset functionalities.
   - Enhanced security through password hashing, JWT generation, and email validation.
   - Enabled users to securely create accounts, log in, and recover passwords.

### 7. **Google Sign-In and Sign-Up**
   - Implemented Google Sign-In and Sign-Up functionalities for enhanced user authentication.
   - Validated Google authentication tokens and created JWTs for secure user sessions.

### 8. **Token Validity Check**
   - Implemented a route to check the validity of provided tokens.
   - Enhanced security by allowing clients to verify token validity before sensitive operations.

## User Settings and Tabs Management

### 9. **User Settings Management**
   - Implemented routes for retrieving and updating user settings.
   - Enhanced the user experience by providing personalized configurations.

### 10. **User Tabs Management**
   - Implemented routes for retrieving, adding, and updating user tabs.
   - Improved content organization and customization for users.

These features collectively lay the groundwork for a secure, modular, and user-friendly application. The commit not only focuses on enhancing security but also contributes to a more organized and personalized user experience. The implemented functionalities provide a strong foundation for future development and user-centric feature additions.

---

# Work completed: Application Feature Implementations and Enhancements

## 27 Jan 2024

## Google Authentication

### 1. **Implement Google Sign-Up Functionality:**
   - Introduced a new route ("/google-signup") and a method in the Google class for handling Google Sign-Up requests.
   - Controller validates the request body, verifies the Google authentication token, and creates a new user if not already existing.
   - Proper error handling for invalid tokens or existing users with corresponding credentials.

### 2. **Implement Google Sign-In Functionality:**
   - Introduced a new route ("/google-signin") and a method in the Google class for handling Google Sign-In requests.
   - Controller validates the request body, verifies the Google authentication token, and creates a JWT for existing users.
   - Proper error handling ensures a robust Google Sign-In process using axios to interact with Google's authentication endpoints.

## Password Management

### 3. **Implement Password Reset Functionality:**
   - Introduced a new route ("/reset-password") and a method in the SignupController class for handling password resets.
   - Controller validates the request body, verifies the token's validity and expiration, and updates the user's password in the database.
   - Proper error handling for user not found, token expiration, or decoding errors.

### 4. **Implement Forgot Password Functionality:**
   - Introduced a new route ("/forgot-password") and a method in the SignupController class for handling forgot password functionality.
   - Validates the request body, generates a temporary token for password reset, and sends it to the user via email.
   - Includes proper error handling and validation for a secure and user-friendly forgot password process.

### 5. **Implement User Login Functionality with Email and Password:**
   - Introduced a login route ("/login") and a login method in the SignupController class for handling user login requests.
   - Controller validates the request body, checks for the existence of a user with the provided email, and verifies the password against the hashed password in the database.
   - Generates a JWT for authentication with appropriate error handling and success logging.

### 6. **Implement User Signup Functionality with Email and Password:**
   - Introduced a signup route ("/signup") and a SignupController class for handling user signup requests.
   - Controller validates the request body, checks for existing users with the same email, and creates a new user with hashed passwords.
   - Generates a JWT for authentication and includes email and password validation functions.

## Prisma Model Enhancement

### 7. **Add Tag and HiddenTag Prisma Models:**
   - Introduced Tag and HiddenTag Prisma models for organizing links with many-to-many relationships.
   - Enhanced the database structure for categorizing and managing links based on user-defined tags and hidden tags.

### 8. **Add Link Prisma Model:**
   - Introduced the Link Prisma model representing individual links with fields such as id, title, url, order, icon, notes, categoryId, createdAt, updatedAt, and isDeleted.
   - Establishes relationships with the Category model for structured content organization.

### 9. **Add Category Prisma Model:**
   - Introduced the Category Prisma model representing categories within the application.
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

# Work completed: Application Feature Implementations and Enhancements

## 29 Jan 2024

## Links and Categories Management

### 1. **Endpoint for Adding a New Link to a Category**
   - Introduced a new route ("/links") and corresponding methods in the LinkController class.
   - Prisma used for updating the database, associating the link with the specified tab and category.
   - Thorough validation on the request body to ensure the presence of required parameters and correct input format.
   - Handles duplicates using the "upsert" Prisma operation.
   - Provides users with an efficient way to add links, associating them with specific categories and tabs.

### 2. **Endpoint for Retrieving Categories Incrementally**
   - Introduced a new route ("/categories-incrementally") and corresponding methods in the CategoryController class.
   - Prisma used for fetching categories, considering lastUpdatedTime when specified.
   - Validation on the request body to ensure the presence of necessary parameters.
   - Offers clients flexibility to obtain categories either in full or incrementally, facilitating efficient category synchronization.

### 3. **Endpoint for Deleting a Category from a Specified Tab**
   - Added a new route ("/categories") and corresponding methods in the CategoryController class.
   - Prisma used to update the user's tab, marking the specified category as deleted.
   - Validation on the request body to ensure the presence of essential parameters.
   - Provides a mechanism for clients to delete categories within specific tabs, improving category data management.

### 4. **Endpoint for Updating an Existing Category in a Specified Tab**
   - Introduced a new route ("/categories") and corresponding methods in the CategoryController class.
   - Prisma used to update the user's tab, modifying the specified category with provided details.
   - Validation on the request body to ensure the presence of essential parameters and order being an integer.
   - Allows clients to dynamically update category details within specific tabs for better customization.

### 5. **Endpoint for Adding a New Category to a Specified Tab**
   - Introduced a new route ("/categories") and corresponding methods in the CategoryController class.
   - Prisma used to update the user's tab, adding a new category with provided details.
   - Validation on the request body to ensure the presence of essential parameters and order being an integer.
   - Introduction of a utility function isInteger for order parameter validation.
   - Enhances the flexibility of tab organization by allowing clients to dynamically add categories to specific tabs.

### 6. **Endpoint for Retrieving All Categories of a Given Tab**
   - Added a new route ("/categories") and corresponding methods in the CategoryController class.
   - Prisma used to fetch the user with the specified tab, including information about the tab's associated categories.
   - Validation on the request body to ensure the required identifier is present.
   - Provides clients with a way to obtain all categories associated with a specific tab for improved data retrieval and management.

### 7. **Incremental Retrieval of User Tabs**
   - Introduced a new route ("/tabs-incrementally") and methods in the TabController class.
   - Controller checks the request body for the lastUpdatedTime parameter and decides whether to return all tabs or only those updated after the specified timestamp.
   - Proper validation to ensure the required lastUpdatedTime parameter is present.
   - Fetches and returns tabs with updatedAt timestamps greater than or equal to the provided lastUpdatedTime, improving tab synchronization efficiency.

These enhancements collectively improve the management of links, categories, and tabs within the application, providing users and clients with more flexible and efficient ways to organize and retrieve data.

---

# Work completed: Application Feature Implementations and Enhancements

## 30 Jan 2024

## Prisma Model Refinement

### 1. **Define HiddenTag and LinkHiddenTag Models:**
   - Updated the HiddenTag model, fixing a typo in the field name from 'idetifier' to 'identifier'.
   - Added fields: 'id', 'name', 'order', 'linkHiddenTags', 'createdAt', 'updatedAt', 'isDeleted'.
   - 'identifier' and 'name' are unique.
   - 'isDeleted' is a boolean field, defaulting to false.

   - Introduced the LinkHiddenTag model:
      - Represents the association between a link and a hidden tag.
      - Fields include 'id', 'linkIdentifier', 'tagIdentifier', 'createdAt', 'updatedAt'.
      - Establishes relations with the Link and HiddenTag models.
      - This commit improves the definition of hidden tags and their association with links.

## User Interaction and Content Management

### 2. **Implement User Logout Functionality:**
   - Introduced a new endpoint ("/logout") and the corresponding method in the SignupController class to handle user logout.
   - The logout method removes the specified session token associated with the user, effectively logging them out.
   - Validation for the logout request body ensures the required token is provided.
   - Users can securely end their sessions and invalidate associated tokens.

### 3. **Implement Endpoint to Retrieve All Tags of the Application:**
   - Introduced a new route ("/tags") and the corresponding method in the TagController class to retrieve all tags of the application.
   - The endpoint fetches tags from the database, excluding those marked as deleted, and returns the list of tags to the client.
   - Users can view and manage all available tags within the application.

### 4. **Implement Endpoint to Move a Link from the Catalog to a Specific Tab and Category:**
   - Introduced a new route ("/catalog/move") and the corresponding method in the LinkController class to move a link from the user's catalog to a specified tab and category.
   - The endpoint validates the request body, ensuring the presence of finalCategoryIdentifier and identifier.
   - If the validation passes, the link is updated in the database, associating it with the provided tab and category.
   - Users can organize catalog links into specific tabs and categories, improving link management and categorization.

### 5. **Implement Endpoint to Fetch Links Incrementally Based on Last Updated Time:**
   - Introduced a new route ("/links-incrementally") and corresponding methods in the LinkController class to retrieve links incrementally.
   - The endpoint supports fetching all links if no lastUpdatedTime is provided and fetching links updated after the specified lastUpdatedTime.
   - Efficient synchronization with the server based on the last update timestamp is facilitated.

### 6. **Implement Endpoint to Retrieve All Links Within a Specific Category:**
   - Introduced a new route ("/links") and associated methods in the LinkController class to fetch all links belonging to a specified category within a given tab.
   - The implementation utilizes Prisma to query the database and retrieve the list of links associated with the provided tabIdentifier and categoryIdentifier.
   - Users can obtain all links within a particular category, facilitating a comprehensive view of their organized content.

### 7. **Implement Endpoint to Move a Link from One Category to Another:**
   - Introduced a new route ("/links/move") and associated methods in the LinkController class to handle the movement of a link from one category to another within a specified tab.
   - The implementation utilizes Prisma to update the link's category association in the database, ensuring it is accurately reflected in the user's content organization.
   - Users have the flexibility to reorganize their content by easily moving links between categories, contributing to a more dynamic and customizable user experience.

### 8. **Implement Endpoint to Delete a Link from a Category:**
   - Introduced a new route ("/links") and associated methods in the LinkController class to handle the deletion of a link from a specified category within a tab.
   - The implementation utilizes Prisma to mark the link as deleted in the database, ensuring it is excluded from future queries.
   - Users can seamlessly remove unwanted links, contributing to a more streamlined and organized content management experience.

### 9. **Implement Endpoint to Update a Link Within a Category:**
   - Introduced a new route ("/links") and corresponding methods in the LinkController class to handle the update of an existing link within a specified category of a tab.
   - The implementation uses Prisma to update the database, including the ability to modify the link's order, title, URL, icon, notes, and associated tags.
   - Users can efficiently update link details and associated tags, contributing to better organization and customization of their content.

---

# Work completed: Application Feature Implementations and Enhancements

## 31 Jan 2024

## Link Management and Event Handling

### 1. **Implement `getAllCatalogLinks` Endpoint in `LinkController`:**
   - Introduced the `getAllCatalogLinks` method in the `LinkController` class to handle the retrieval of all catalog links for a user.
   - The method queries the database for the user's catalog links by excluding those associated with any category.
   - The resulting links are then returned as a response.
   - This feature enhances the API by providing an endpoint to fetch all catalog links associated with a user, facilitating the efficient retrieval of uncategorized links.

### 2. **Connected Events and Additional Features:**
   - Added IP location support and a way to track link lifecycle.
   - Implemented various event handling methods for improved application functionality and user interaction.

### 3. **Implement `deletedCategory` Method in `CategoryEvent` Class:**
   - Introduced the `deletedCategory` method in the `CategoryEvent` class to handle the deletion of categories.
   - Validates the provided event data, fetches the category to be deleted, and ensures that the category is marked as deleted.
   - Proceeds to update associated links to reflect the deletion.
   - A new private method, `validateDeletedCategoryEventData`, is added for data validation.
   - Enhances the application's ability to handle category deletions gracefully.

### 4. **Implement `deletedTab` Method in `TabEvent` Class:**
   - Introduced the `deletedTab` method in the `TabEvent` class to handle the deletion of tabs.
   - Validates the provided event data, fetches the tab to be deleted, and ensures that the tab is marked as deleted.
   - Proceeds to update associated categories and links to reflect the deletion.
   - A new private method, `validateDeletedTabEventData`, is added for data validation.
   - Enhances the application's ability to handle tab deletions gracefully.

### 5. **Implement `farewellEmail` Sending in `UserEvent` Class:**
   - Introduced the functionality to send a farewell email to users upon the occurrence of the `SEND_FAREWELLS_EMAIL` API event.
   - The `sendFarewellsEmail` method performs user validation, fetches necessary environment variables, and sends a farewell email using the `farewellEmailRender` template.
   - A new private method, `validateSendFarewellsEmailEventData`, is added for data validation.
   - Enables the application to gracefully bid farewell to users through a personalized email.

### 6. **Implement User Deletion in `UserEvent` Class:**
   - Introduced the functionality to delete a user and associated data upon the occurrence of the `USER_DELETED` API event.
   - The `deleteUser` method performs user validation, checks if the user is already deleted, and deletes all related tabs, categories, and links with a transactional approach for data integrity.
   - A private method, `validateDeleteUserEventData`, is added for data validation.
   - Enables proper handling of user deletion requests in the Bookmark Manager application.

### 7. **Implement Password Reset Success Email Sending in `AuthenticationEvent` Class:**
   - Introduced the capability to send a password reset success email to users upon a specific API event.
   - The `sendResetPasswordSuccessEmail` method handles data validation, user retrieval, email template generation, and the actual email sending process.
   - A private method, `validateSendResetPasswordSuccessEmailData`, is added for data validation.
   - Ensures users receive confirmation of a successful password reset in the Bookmark Manager application.

### 8. **Implement Password Reset Link Email Sending in `AuthenticationEvent` Class:**
   - Introduced the ability to send a password reset link email to users upon a specific API event.
   - The `sendPasswordResetLinkEmail` method handles data validation, user retrieval, password reset link creation, email template generation, and the actual email sending process.
   - A private method, `validateSendPasswordResetLinkEmailEventData`, is added for data validation.
   - Ensures users receive a secure and convenient way to reset their passwords in the Bookmark Manager application.

### 9. **Implement Greeting Email Sending in `UserEvent` Class:**
   - Introduced the capability to send a greeting email to users upon a specific API event.
   - The `sendGreetingEmail` method handles data validation, user retrieval, email template generation, and the actual email sending process.
   - A private method, `validateSendGreetingEmailEventData`, is added for data validation.
   - Aims to provide a welcoming experience for users joining the Bookmark Manager application.

### 10. **Enhancements to `getAllLinks` and `addLink` Methods:**
   - Extended the `getAllLinks` method to include link tags, providing a more detailed representation of links within a specified tab and category.
   - Improved the `addLink` method by introducing a new array, `hiddenTags`, and updating the Prisma update block to connect or create hidden tags when adding a new link.
   - Enhanced functionality for categorizing and organizing links, contributing to a more robust and flexible link management system.

---

