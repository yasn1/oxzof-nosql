
# oxzof-nosql

`oxzof-nosql` is a lightweight, SQLite-based NoSQL-like database implementation for Node.js. This package provides a set of functions for simulating NoSQL database operations (insert, update, find, delete) using SQLite under the hood.

This package is designed to mimic the structure of a NoSQL database, with automatic unique ID generation, collection handling, and simple API for basic operations like inserting and querying documents. It's perfect for projects where you need a simple and lightweight database without the need for an external NoSQL service.

## Features

- **Insert one or many documents** with automatic unique `_id`.
- **Update one or many documents** with filter-based conditions.
- **Find documents** based on filters or query all documents.
- **Delete one or many documents**.
- **Drop a collection (table)**.
- **Automatic creation of collections** if they don't already exist.
- **SQLite-based** lightweight solution for local storage.

## Installation

You can install `oxzof-nosql` from npm:

```bash
npm install oxzof-nosql
```

## Usage

### Initialize `oxzof-nosql`

To use the `oxzof-nosql` class, first import it and create an instance.

```javascript
const NoSQLDB = require('oxzof-nosql');
const db = new NoSQLDB('path/to/database.db'); // Provide the SQLite database file path
```

### Create a Collection

Create a collection (SQLite table) if it doesn't already exist.

```javascript
db.createCollection('users')
    .then(console.log)  // Output: Collection 'users' created.
    .catch(console.error);
```

### Insert One Document

Insert a single document into a collection. The document will automatically receive a unique `_id`.

```javascript
const user = { name: 'Alice', age: 30, gender: 'F' };

db.insertOne('users', user)
    .then(data => console.log(data))  // Output: { _id: 'unique-id', name: 'Alice', age: 30, gender: 'F' }
    .catch(err => console.error(err));
```

### Insert Many Documents

Insert multiple documents into a collection. Each document will automatically receive a unique `_id`.

```javascript
const users = [
    { name: 'Alice', age: 30, gender: 'F' },
    { name: 'Bob', age: 35, gender: 'M' }
];

db.insertMany('users', users)
    .then(data => console.log(data))  // Output: Array of inserted documents
    .catch(err => console.error(err));
```

### Find Documents

Find documents in a collection based on a filter. If no filter is provided, all documents will be returned.

```javascript
db.find('users', { gender: 'F' })
    .then(data => console.log(data))  // Output: Array of users with gender 'F'
    .catch(err => console.error(err));
```

### Find One Document

Find a single document based on a filter.

```javascript
db.findOne('users', { name: 'Alice' })
    .then(data => console.log(data))  // Output: { _id: 'unique-id', name: 'Alice', age: 30, gender: 'F' }
    .catch(err => console.error(err));
```

### Update One Document

Update a single document. If the document is found, it will be updated with the new data.

```javascript
db.updateOne('users', { name: 'Alice' }, { age: 31 })
    .then(data => console.log(data))  // Output: Updated user data
    .catch(err => console.error(err));
```

### Update Many Documents

Update multiple documents that match a filter. The method returns the number of successfully updated documents.

```javascript
db.updateMany('users', { gender: 'M' }, { age: 40 })
    .then(result => console.log(result))  // Output: { success: 2 }
    .catch(err => console.error(err));
```

### Delete One Document

Delete a single document based on a filter.

```javascript
db.deleteOne('users', { name: 'Alice' })
    .then(result => console.log(result))  // Output: Deleted document
    .catch(err => console.error(err));
```

### Delete Many Documents

Delete multiple documents based on a filter.

```javascript
db.deleteMany('users', { age: 30 })
    .then(result => console.log(result))  // Output: Deleted documents
    .catch(err => console.error(err));
```

### Drop Collection

Drop a collection (delete the table) from the database.

```javascript
db.dropCollection('users')
    .then(console.log)  // Output: Collection 'users' dropped.
    .catch(console.error);
```

### Close the Database

Close the database connection when you're done.

```javascript
db.close();
```

## Methods Overview

- **`createCollection(name)`**: Creates a new collection (SQLite table) if it doesn't exist.
- **`insertOne(collection, data)`**: Inserts one document into a collection with an automatically generated `_id`.
- **`insertMany(collection, dataArray)`**: Inserts multiple documents into a collection, each with a unique `_id`.
- **`find(collection, filter)`**: Finds documents in a collection based on the provided filter.
- **`findOne(collection, filter)`**: Finds one document in a collection based on the provided filter.
- **`updateOne(collection, filter, newData)`**: Updates one document in a collection.
- **`updateMany(collection, filter, newData)`**: Updates multiple documents in a collection.
- **`deleteOne(collection, filter)`**: Deletes one document from a collection.
- **`deleteMany(collection, filter)`**: Deletes multiple documents from a collection.
- **`dropCollection(name)`**: Drops (deletes) a collection.
- **`close()`**: Closes the database connection.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
