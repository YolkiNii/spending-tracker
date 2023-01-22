const mysql = require('mysql');
const db = require('../config/db');

class Spendings {
  static async getAllUserSpending(username) {
    return new Promise((resolve, reject) => {
      const sql =
        'SELECT spending_id, name, note, amount, spending_date ' +
        'FROM spendings ' +
        'WHERE user_id = ' +
        '(SELECT user_id ' +
        'FROM users ' +
        'WHERE username = ' +
        mysql.escape(username) +
        ')';

      db.query(sql, (err, result) => {
        if (err) reject(err);

        const spendings = JSON.parse(JSON.stringify(result));

        if (spendings.length === 0) resolve(null);

        resolve(spendings);
      });
    });
  }

  static async addUserSpending(username, spendingInfo) {
    return new Promise((resolve, reject) => {
      const sql =
        'INSERT INTO spendings (name, note, amount, spending_date, user_id) ' +
        'VALUES (' +
        mysql.escape(spendingInfo.name) +
        ', ' +
        mysql.escape(spendingInfo.note) +
        ', ' +
        mysql.escape(spendingInfo.amount) +
        ', ' +
        mysql.escape(spendingInfo.spendingDate) +
        ', (SELECT user_id ' +
        'FROM users ' +
        'WHERE username = ' +
        mysql.escape(username) +
        '))';
      db.query(sql, (err) => {
        if (err) reject(err);

        resolve();
      });
    });
  }

  static async editUserSpending(spendingID, spendingInfo) {
    return new Promise((resolve, reject) => {
      const sql =
        'UPDATE spendings ' +
        'SET name = ?, note = ?, amount = ?, spending_date = ? ' +
        'WHERE spending_id = ?';
      const values = [
        spendingInfo.name,
        spendingInfo.note,
        spendingInfo.amount,
        spendingInfo.spendingDate,
        spendingID
      ];

      db.query(sql, values, (err) => {
        if (err) reject(err);

        resolve();
      });
    });
  }

  static async deleteUserSpending(spendingID) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE ' + 'FROM spendings ' + 'WHERE spending_id = ?';
      const values = [spendingID];

      db.query(sql, values, (err) => {
        if (err) reject(err);

        resolve();
      });
    });
  }
}

module.exports = Spendings;
