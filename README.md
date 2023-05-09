# Karlie House of Games API

## Background

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

## Project setup

This project uses PostgreSQL as the database. To run the project locally, you need to set up two environment variables: one for development environment and one for test environment. These environment variables will contain the connection details for your PostgreSQL database.

### Set up the development database

To set up the database for local development, follow these steps:

1. Create a new file in the root of the project called ".env.development".

2. Open the file in a text editor and add the following environment variables:

```
PGDATABASE=mydatabase
```

Note: Replace "mydatabase" with your own database connection details.

3. Save the file and close it.

### Set up the test database

To set up the database for testing, follow these steps:

1. Create a new file in the root of the project called ".env.test".

2. Open the file in a text editor and add the following environment variables:

```
PGDATABASE=mydatabase_text
```

Note: Replace "mydatabase_text" with your own test database connection details.

3. Save the file and close it.
