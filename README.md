# NoSQL Database with SQLite (Custom Implementation)

This project provides a simple **NoSQL-style database** using SQLite. Similar to MongoDB, data is stored in JSON format, and each entry is assigned a unique `_id`. The database supports fundamental MongoDB-like operations such as `insertOne`, `find`, `findOne`, and `createCollection`.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Database Connection](#database-connection)
  - [Creating a Collection](#creating-a-collection)
  - [Inserting Data (insertOne)](#inserting-data-insertone)
  - [Querying Data (find and findOne)](#querying-data-find-and-findone)
  - [Closing the Database (close)](#closing-the-database-close)
- [API Functions](#api-functions)
  - [createCollection](#createcollection)
  - [insertOne](#insertone)
  - [find](#find)
  - [findOne](#findone)
  - [close](#close)
- [Testing](#testing)

## Installation

1. **Install Node.js**  
   Ensure you have [Node.js](https://nodejs.org/) installed on your system.

2. **Install Dependencies**  
   Run the following command in your project's root directory:
   ```bash
   npm install
   ```
   This will install all required dependencies, including SQLite3 and UUID.

## Usage

### Database Connection

To establish a connection to the database:

```javascript
const NoSQLDB = require("oxzof-nosql");
const db = new NoSQLDB();
```

Once connected, you will see the message: `Database connected.`

### Creating a Collection

To create a new collection:

```javascript
await db.createCollection("users");
```

If the collection already exists, it will not be recreated.

### Inserting Data (insertOne)

To insert a new document:

```javascript
await db.insertOne("users", { name: "John", age: 25, gender: "M" });
```

This operation automatically assigns a unique `_id` and stores the data in the collection.

### Querying Data (find and findOne)

- **Retrieve all documents:**

```javascript
const users = await db.find("users");
console.log(users); // Lists all users
```

- **Find a specific document:**

```javascript
const user = await db.findOne("users", { name: "John" });
console.log(user); // Returns the first matching document
```

`find` returns an array of all matching documents, while `findOne` returns only the first match.

### Closing the Database (close)

To close the database connection:

```javascript
db.close();
```

This function terminates the database connection and stops the application.

## API Functions

### `createCollection(name)`
Creates a new collection.

- **Parameters:**
  - `name` (String): The name of the collection.

- **Example:**
  ```javascript
  await db.createCollection("users");
  ```

### `insertOne(collection, data)`
Inserts a document with a unique `_id` and stores it in JSON format.

- **Parameters:**
  - `collection` (String): The collection name.
  - `data` (Object): The document to be inserted.

- **Example:**
  ```javascript
  await db.insertOne("users", { name: "John", age: 25, gender: "M" });
  ```

- **Return Value:**
  `{ _id, ...data }`: Returns the inserted document.

### `find(collection, filter)`
Finds all documents in a collection. Filtering is optional.

- **Parameters:**
  - `collection` (String): The collection name.
  - `filter` (Object): The search criteria.

- **Example:**
  ```javascript
  const users = await db.find("users", { name: "John" });
  console.log(users);
  ```

- **Return Value:**
  `Array`: Returns an array of matching documents.

### `findOne(collection, filter)`
Finds the first document that matches the filter criteria.

- **Parameters:**
  - `collection` (String): The collection name.
  - `filter` (Object): The search criteria.

- **Example:**
  ```javascript
  const user = await db.findOne("users", { name: "John" });
  console.log(user);
  ```

- **Return Value:**
  `Object`: Returns the first matching document.

### `close()`
Closes the database connection.

- **Example:**
  ```javascript
  db.close();
  ```

## Testing

Below is a sample `index.js` file to test the project:

```javascript
const NoSQLDB = require("oxzof-nosql");
const db = new NoSQLDB();

async function main() {
    console.log(await db.createCollection("users"));

    // Each inserted document will have a unique _id
    console.log(await db.insertOne("users", { name: "John", age: 25, gender: "M" }));
    console.log(await db.insertOne("users", { name: "Mike", age: 30, gender: "M" }));
    console.log(await db.insertOne("users", { name: "Anna", age: 22, gender: "F" }));

    console.log("All users:", await db.find("users"));
    console.log("Find John:", await db.findOne("users", { name: "John" }));

    db.close();
}

main();
```

---

### **About the Project**
This project provides a NoSQL-style database architecture on top of SQLite. It is ideal for those who need the flexibility of NoSQL databases like MongoDB while leveraging the simplicity of a file-based SQLite storage system. Each inserted document is assigned a unique `_id` and is stored in JSON format.

