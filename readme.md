### Setting up Local Development Environment and Cloning the Repository

#### Prerequisites:
- Download and Install XAMPP from the official website.
- Have Visual Studio Code installed on your system.
- Have Git installed on your system.
- Have Node.js and npm installed on your system.

#### Part 1: XAMPP Setup and User Creation

1. **Download and Install XAMPP:**
   - Download XAMPP from the official website and follow the installation instructions.

2. **Start Apache and MySQL Servers:**
   - Open XAMPP after installation and start both Apache and MySQL servers.

3. **Access phpMyAdmin:**
   - If the servers are running correctly, phpMyAdmin will be accessible at [http://localhost](http://localhost).

4. **Create a New User in phpMyAdmin:**
   - Navigate to phpMyAdmin and click on "User Accounts."
   - Add a new user with the username "bookmarkmanager" and password.
   - Grant all privileges and create a database with the same name.

#### Part 2: Clone Repository and Configure Environment

5. **Clone Repository to Local Machine:**
   - Open your terminal and navigate to the desired folder.
   - Run: `git clone https://prasenjeetkr@bitbucket.org/iSunilSV/bookmarksmanager.git`.
   - Authenticate if prompted.

6. **Open Project in VSCode:**
   - Navigate to the cloned project in the terminal.
   - Run: `code .` to open the repository in Visual Studio Code.

7. **Configure Environment Variables:**
   - Navigate to the "server" folder inside the "packages" folder.
   - Copy the content of ".env.example" file.
   - Create a new file named ".env" in the same location and paste the copied content.
   - Replace the placeholder for "RESEND_API_KEY" with the actual API key obtained from [resend.com](https://resend.com).

#### Part 3: Setup and Start the Server

8. **Install Dependencies and Build Server:**
   - In the terminal, navigate to the "server" folder.
   - Run: `npm install` to install dependencies.
   - Run: `npm run build` to build the server.

9. **Migrate Database:**
   - Run: `npm run migrate` to migrate the database.

10. **Start the Server:**
    - Run: `npm run start` to start the server.

11. **Verify Server Running:**
    - Check if the server is running at [http://localhost:8081/server/](http://localhost:8081/server/).

#### Part 4: Setting up Client

### Step 1: Clone the Project
   - Clone the project repository and switch to the `bmclient` branch.
```bash
git clone <repository_url>
cd <project_folder>
git checkout bmclient
```

### Step 2: Configure Environment Variables
   - Navigate to `packages\client\bmclient` directory in Command Prompt.
```bash
cd packages\client\bmclient
copy .env.example .env
```
   - Open the `.env` file and set necessary variables.

### Step 3: Install Dependencies
   - Run the following command in the same directory to install project dependencies using npm:
```bash
npm install
```

### Step 4: Start Development Server
   - Once the dependencies are installed, start the development server:
```bash
npm run dev
```

### Step 5: Check Your Client
   - Your client is now live! Check the terminal for the link to access it. Open a web browser and navigate to the provided link to view your client application.

By following these steps, you've successfully set up your local development environment and configured the client for your project.