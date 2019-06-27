const Mongoose = require('mongoose');
let Debug = require('debug')('card-gateway:Mongo');
Mongoose.set('useCreateIndex', true);
/**
 * mongoose try to conenct with database url
 */
let databaseUrl = _config['databaseUrl'];
let connection = Mongoose.connection;


Mongoose.connect(databaseUrl, { 'useNewUrlParser': true });

connection.once('open', function () {
    Debug('Connected to Database')
});

connection.on('disconnected', function () {
    Mongoose.connect(databaseUrl, { 'useNewUrlParser': true });
});
