# Karlie House of Games API

## 🚀 Overview

Welcome, fellow developer, to the Karlie House of Games API! This project simulates backend services much like those of popular web platforms such as Reddit. With our API, you can programmatically access application data, allowing for efficient integration with any front-end architecture you choose.

## 🌐 Live Demo

Experience the project in action. Visit our live hosted version [here](https://nc-games-s0lm.onrender.com/api#)

## 📝 Project Summary

The Karlie House of Games API is a comprehensive backend service enabling the retrieval and manipulation of gaming data, and this project uses PostgreSQL as its database. The API creates a pathway for front-end applications to interact with an array of game-related data available at the Karlie House of Games. The service is adept at handling various types of requests, such as fetching specific game data, updating data, and managing user interactions. To run this project locally, two environment variables need to be set up: one for the development environment and one for the test environment. These environment variables contain the connection details for your PostgreSQL database, allowing for the smooth operation of this service in different environments.

## 🛠 Prerequisites

This project utilizes Node.js and PostgreSQL. Please ensure you have the following minimum versions installed:

- Node.js: Version 14 or later
- PostgreSQL: Version 12 or later

## 🎮 Getting Started

Here are the steps to clone the project, install dependencies, seed your local database, and run tests:

### 1. 📂 Cloning the Project

Clone this repository to your local machine:

```bash
git clone https://github.com/KarlieKKY/nc-games.git
```

### 2. 🛠 Installing Dependencies

Navigate to your project directory and install the necessary dependencies:

```bash
cd nc-games
npm install
```

### 3. 🌍 Configuring Environment Variables

This project requires two .env files, .env.development and .env.test, to specify the databases' connection details for your development and testing environments respectively.

🌱 Development Environment Setup

- Create a new file named .env.development in the root directory.

- Open the file in a text editor and specify your development database connection detail:

```bash
PGDATABASE=mydatabase
```

Note: Replace mydatabase with the actual name of your development database, which should match the database name specified in db/setup.sql.

- Save the file and close it.

🧪 Testing Environment Setup

- Create a new file named .env.test in the root directory.

- Open this file and specify your test database connection detail:

```bash
PGDATABASE=mydatabase_test
```

Note: Replace mydatabase_test with the actual name of your test database, which should match the testing database name in db/setup.sql.

- Save the file and close it.

### 4. 🌱 Seeding the Database

Once your environment variables are set, seed the local database using:

```bash
npm run seed
```

### 5. 🧪 Running Tests

Finally, to ensure everything is set up correctly, run the tests:

```bash
npm test
```

🎉 You've now successfully set up the project locally and are ready to explore and contribute.

We look forward to your insights and contributions to the Karlie House of Games API! If you encounter any issues or have any questions, don't hesitate to reach out. Let's continue creating something exceptional together. Happy coding! 🎈
