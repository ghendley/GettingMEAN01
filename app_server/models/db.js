require('dotenv').config();

const mongoose = require('mongoose');
const readline = require('readline');

const dbUri = process.env.GETTING_MEAN_MONGO_URI;

mongoose.connect(dbUri, {useNewUrlParser: true});

mongoose.connection.on('connected', () => {
    console.log(`Mongoose connected to ${dbUri}.`);
});
mongoose.connection.on('error', err => {
    console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected.');
});

const gracefulShutdown = (msg, callback) => {
    mongoose.connection.close(() => {
        console.log(`Mongoose disconnected through ${msg}.`);
        callback();
    });
};

// Force emission of SIGINT in Windows termination
// Not currently using Windows, but who knows
if (process.platform === 'win32') {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.on('SIGINT', () => {
        process.emit('SIGINT');
    });
}

// For nodemon restarts
// Not currently using nodemon, but who knows
process.once('SIGURS2', () => {
    gracefulShutdown('nodemon restart', () => {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// For normal app termination
process.on('SIGINT', () => {
    gracefulShutdown('app termination', () => {
        process.exit(0);
    });
});

// For Heroku app termination
// Not currently using Heroku, but who knows
process.on('SIGTERM', () => {
    gracefulShutdown('Heroku app shutdown', () => {
        process.exit(0);
    });
});
