import mysql from 'mysql';

export const dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pisicut@1999',
    database: 'codingne_meditations'
});

dbConn.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});