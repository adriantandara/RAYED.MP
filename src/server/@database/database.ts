import * as mysql2 from 'mysql2/promise';

const connectionData = require('./connection.json');

export class Database {
    private connection: any;

    constructor() {
        this.connect();
    }

    async connect() {
        try {
            this.connection = await mysql2.createConnection({
                host: connectionData.host,
                user: connectionData.user,
                password: connectionData.password,
                database: connectionData.database
            });
            console.log("Successfully connected to the database.");
        } catch (error) {
            console.error("Error connecting to the database: " + error);
        }
        process.on('SIGINT', this.end.bind(this));
    }

    async isConnected() {
        return !!this.connection;
    }

    async query(query: string) {
        try {
            if (!this.connection) {
                console.error("Not connected to the database");
                return;
            }
            const [rows] = await this.connection.query(query);
            return rows;
        } catch (error) {
            console.error("Error executing query: " + error);
            return error;
        }
    }
    async end() {
        try {
            await this.connection.end();
            console.log("Successfully closed the database connection.");
        } catch (error) {
            console.error("Error closing the database connection: " + error);
        }
    }
}