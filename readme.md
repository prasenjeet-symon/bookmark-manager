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
   - Clone the project to your local machine. ( already done in the above steps skip this step)

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
   - Your client is now live! Check the terminal for the link to access it. Open a web browser and navigate to the provided link to view your client application. ( http://localhost:5173/ )

By following these steps, you've successfully set up your local development environment and configured the client for your project.

---

## Setting Up Production-Ready Resend API Keys and Email Configuration

### Step 1: Sign Up and Log In

1. Go to [Resend](https://resend.com/) and sign up using your desired email ID and password. If you don't have an account, create a new one.

### Step 2: Add Your Domain

1. Once logged in, navigate to the "Domains" section in the dashboard.
2. Click on the "Add Domain" button.
3. A popup will appear; fill in your desired domain name (e.g., "example.com") and click "Add."

### Step 3: Configure DNS Records

1. After adding the domain, you'll see MX record details, TXT record details, and DKIM records.
2. Access your domain provider's dashboard and locate the DNS record configuration page.
3. Add all the DKIM, SPF, and DMARC records provided by Resend.
4. Once added, return to the Resend dashboard and click "VERIFY DNS RECORDS" to ensure everything is correctly configured.

### Step 4: Generate API Key

1. In the Resend dashboard, go to the "API" menu.
2. Click on "Create API key."
3. A popup will appear; choose a name for your API key and click "Add."
4. Once added, copy the API key generated.

### Step 5: Update Environment Variables

1. Open your server's ENV file.
2. Add the copied API key to your ENV file.
3. Ensure that the "RESEND_FROM" variable contains your domain instead of "resend." and "RESEND_API_KEY" variable contains your API key.

### Step 6: Final Configuration

By completing the above steps, you have successfully configured Resend API keys and email for your server. Now, your server is ready to send emails using Resend.
