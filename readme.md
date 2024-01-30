### Setting up Local Development Environment and Cloning the Repository

#### Part 1: XAMPP Setup and User Creation

1. **Download and Install XAMPP:**
   - Download XAMPP from the official website.
   - Follow the setup wizard instructions to install it.

2. **Start Apache and MySQL Servers:**
   - Open XAMPP after installation and start both Apache and MySQL servers.

3. **Access phpMyAdmin:**
   - If the servers are running correctly, phpMyAdmin will be accessible at [http://localhost](http://localhost).

4. **Create a New User in phpMyAdmin:**
   - Click on "User Accounts" in the phpMyAdmin top header.
   - Under the "New" section, click "Add user account."
   - Set the "User name" and "Password" to "bookmarkmanager."
   - Check "Create database with the same name and grant all privileges."
   - Under "Global privileges," tick "Check all."
   - Click "Go" to create the user.

#### Part 2: Clone Repository and Configure Environment

5. **Clone Repository to Local Machine:**
   - Open your terminal and navigate to the desired folder.
   - Run the command: `git clone https://prasenjeetkr@bitbucket.org/iSunilSV/bookmarksmanager.git`.
   - Authenticate if prompted.

6. **Open Project in VSCode:**
   - Download and install Visual Studio Code if not already installed.
   - Navigate to the cloned project in the terminal.
   - Run: `code .` to open the repository in VSCode.

7. **Configure Environment Variables:**
   - Go to the "server" folder inside the "packages" folder.
   - Locate the file ".env.example" and copy its content.
   - Create a new file named ".env" in the same location and paste the copied content.
   - Replace the placeholder for "RESEND_API_KEY" with the API key obtained from [resend.com](https://resend.com) after creating an account.

#### Part 3: Setup and Start the Server

8. **Install Dependencies and Build Server:**
   - Ensure your terminal is in the "server" folder.
   - Run: `npm install` to install dependencies.
   - Run: `npm run build` to build the server.

9. **Migrate Database:**
   - Run: `npm run migrate` to migrate the database.

10. **Start the Server:**
    - Run: `npm run start` to start the server.

11. **Verify Server Running:**
    - Check if the server is running at [http://localhost:8081/server/](http://localhost:8081/server/).

#### Part 4: Testing with Postman

12. **Test API with Postman:**
    - Open Postman and test the API endpoints on [http://localhost:8081/server/](http://localhost:8081/server/).
