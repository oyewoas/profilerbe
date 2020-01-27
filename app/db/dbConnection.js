const mongoose = require('mongoose');
const env = require('../../env');


class Database {
    constructor() {
        this.dbConnect();
    }
    dbConnect() {

            mongoose.connect(`${env.mongodb_url}`, {useNewUrlParser: true, useCreateIndex: true})
                .then(() => {
                    console.log('Database connection successful');

                })
                .catch(err => {
                    console.error('Database connection error');
                });

    }
}


module.exports = new Database();