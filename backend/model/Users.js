const mysql = require('mysql');
const db = require('../config/db');

class Users {
    static async findUserByUsername (username) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE username = " + mysql.escape(username);
            db.query(sql, (err, result) => {
                const user = JSON.parse(JSON.stringify(result));
                if (err)
                    reject(err);

                if (user.length === 0)
                    resolve(null);

                resolve(user[0]);
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

    static async setUserRefreshToken(username, refreshToken) {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE users SET refresh_token = ' + mysql.escape(refreshToken) + ' WHERE username =' + mysql.escape(username);
            db.query(sql, (err) => {
                if (err)
                    reject(err);
                
                resolve();
            })
        });
    }
}

module.exports = Users;