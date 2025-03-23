const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

class NoSQLDB {
    constructor(filename = "./database/database.db") {
        const dir = path.dirname(filename);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        this.db = new sqlite3.Database(filename, (err) => {
            if (err) console.error("Database error:", err.message);
            else console.log("Database connected.");
        });
        this.keepAlive = setInterval(() => {}, 1000);
        this.lastTimestamp = 0;
        this.sequence = 0;
    }

    generateUniqueId() {
        const timestamp = Date.now();
        if (timestamp === this.lastTimestamp) {
            this.sequence += 1;
        } else {
            this.sequence = 0;
            this.lastTimestamp = timestamp;
        }
        return `${timestamp}${this.sequence}`;
    }

    createCollection(name) {
        return new Promise((resolve, reject) => {
            const sql = `CREATE TABLE IF NOT EXISTS ${name} (_id TEXT PRIMARY KEY, data TEXT)`;
            this.db.run(sql, (err) => {
                if (err) reject(err);
                else resolve(`Collection '${name}' created.`);
            });
        });
    }

    insertOne(collection, data) {
        return new Promise(async (resolve, reject) => {
            await this.createCollection(collection);
            
            const _id = (Date.now() * 1000 + Math.floor(Math.random() * 1000)).toString();
            
            const dataWithId = { _id, ...data };
            const jsonData = JSON.stringify(dataWithId);
            
            const sql = `INSERT INTO ${collection} (_id, data) VALUES (?, ?)`;
    
            this.db.run(sql, [_id, jsonData], function (err) {
                if (err) reject(err);
                else resolve(dataWithId);
            });
        });
    }
    
    insertMany(collection, dataArray) {
        let t = 0;
        return new Promise(async (resolve, reject) => {
            dataArray.map(data => {
                const _id = (Date.now() * 1000 + Math.floor(Math.random() * 1000)).toString()+t;
                t=+2
                const jsonData = { _id, ...data };
                const sql = `INSERT INTO ${collection} (_id, data) VALUES (?, ?)`;
                this.db.run(sql, [_id, JSON.stringify(jsonData)], function (err) {
                    if (err) reject(err);
                    else resolve(dataArray);
                });
        });
        })
    }
    
    
    

    find(collection, filter = {}) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT _id, data FROM ${collection}`;
            this.db.all(sql, [], (err, rows) => {
                if (err) return reject(err);
                const results = rows.map(row => {
                    try {
                        return { _id: row._id, ...JSON.parse(row.data) };
                    } catch (error) {
                        console.error("Json parser error:", row.data);
                        return null;
                    }
                }).filter(Boolean);
                resolve(results.filter(item => Object.keys(filter).every(key => item[key] === filter[key])));
            });
        });
    }

    findOne(collection, filter = {}) {
        return this.find(collection, filter).then(results => results[0] || null);
    }

    updateOne(collection, filter, newData) {
        return new Promise((resolve, reject) => {
            this.findOne(collection, filter).then(oldData => {
                if (!oldData) {
                    return resolve(false);
                }
    
                const updatedData = { ...oldData, ...newData };
                const sql = `UPDATE ${collection} SET data = ? WHERE _id = ?`;
                this.db.run(sql, [JSON.stringify(updatedData), oldData._id], function (err) {
                    if (err) reject(err);
                    else resolve(updatedData);
                });
            }).catch(err => reject(err));
        });
    }
    
    updateMany(collection, filter, newData) {
        return new Promise((resolve, reject) => {
            this.find(collection, filter).then(results => {
                if (results.length === 0) {
                    return resolve({ success: 0 });
                }
    
                let updatedCount = 0;
    
                const updatePromises = results.map(oldData => {
                    const updatedData = { ...oldData, ...newData };
                    if (JSON.stringify(oldData) === JSON.stringify(updatedData)) {
                        return Promise.resolve(); 
                    }
    
                    const sql = `UPDATE ${collection} SET data = ? WHERE _id = ?`;
                    return new Promise((res, rej) => {
                        this.db.run(sql, [JSON.stringify(updatedData), oldData._id], function (err) {
                            if (err) {
                                rej(err);
                            } else {
                                updatedCount++;
                                res();
                            }
                        });
                    });
                });
    
                Promise.all(updatePromises)
                    .then(() => resolve({ success: updatedCount }))
                    .catch(err => reject(err));
            }).catch(err => reject(err));
        });
    }
    
    

    deleteOne(collection, filter) {
        return new Promise((resolve, reject) => {
            this.findOne(collection, filter).then(found => {
                if (!found) return resolve(null);
                const sql = `DELETE FROM ${collection} WHERE _id = ?`;
                this.db.run(sql, [found._id], function (err) {
                    if (err) reject(err);
                    else resolve({ deleted: found });
                });
            });
        });
    }

    deleteMany(collection, filter) {
        return this.find(collection, filter).then(results => {
            return Promise.all(results.map(item => this.deleteOne(collection, { _id: item._id })));
        });
    }

    dropCollection(name) {
        return new Promise((resolve, reject) => {
            const sql = `DROP TABLE IF EXISTS ${name}`;
            this.db.run(sql, (err) => {
                if (err) reject(err);
                else resolve(`Collection '${name}' dropped.`);
            });
        });
    }

    close() {
        clearInterval(this.keepAlive);
        this.db.close(() => {
            console.log("Database closed.");
            process.exit(0);
        });
    }
}

module.exports = NoSQLDB;