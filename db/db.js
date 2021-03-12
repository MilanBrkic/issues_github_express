const dburl = { DBHost: "mongodb://localhost:27017/issues_api" };
const dburltest = { DBHost: "mongodb://localhost:27017/issues_api_test" };
const db = require('mongoose');

function connect() {

    if (process.env.NODE_ENV === 'test') {
        db.connect(dburltest.DBHost, { useNewUrlParser: true, useUnifiedTopology: true });
    }
    else {
        db.connect(dburl.DBHost, { useNewUrlParser: true, useUnifiedTopology: true });

    }

    return db;

}
module.exports = connect;