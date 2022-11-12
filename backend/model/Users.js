const mysql = require('mysql');
const db = require('../config/db');

class Users {
    static async findUserByUsername (username) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT username FROM users WHERE username = " + mysql.escape(username);
            db.query(sql, (err, result) => {
                if (err) 
                    reject(err)
                
                resolve(result);
            });
        })
    }

    static async addUser (firstName, lastName, email, username, hashPassword) {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO users (first_name, last_name, email, username, hash_password) VALUES ?'
            const values = [[firstName, lastName, email, username, hashPassword]];
            db.query(sql, [values], (err) => {
                if (err)
                    reject(err);
                
                resolve();
            });
        })
    }
}

module.exports = Users;