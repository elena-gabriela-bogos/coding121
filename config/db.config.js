import mysql from 'mysql';

export const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'codingne_meditations'
});

dbConn.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});