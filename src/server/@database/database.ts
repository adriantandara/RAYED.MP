import * as mysql2 from 'mysql2';
import * as fs from 'fs';

interface ConnectionData {
  host: string;
  user: string;
  password: string;
  database: string;
}

const data = fs.readFileSync('connection.json', 'utf8');
const connectionData: ConnectionData = JSON.parse(data);

export class Database {
    private connection: any;

    constructor() {
        this.connect();
    }

    connect() {
        this.connection = mysql2.createConnection({
            host: connectionData.host,
            user: connectionData.user,
            password: connectionData.password,
            database: connectionData.database
        });
        this.connection.connect((err: string) => {
            if (err) {
                console.error("Error connecting to the database: " + err);
                return;
            }
            console.log("Successfully connected to the database.");
        });
        process.on('SIGINT', this.end.bind(this));
    }

    isConnected() {
        return this.connection.state === 'authenticated';
    }

    query(query: string, values?: any, callback?: any) {
        this.connection.query(query, values, (error: any, results: any) => {
            if (error) {
                console.error("Error executing query: " + error);
                return error;
            }
            callback(results);
        });
    }
    end() {
        this.connection.end((error: any) => {
            if (error) {
                console.error("Error closing the database connection: " + error);
            } else {
                console.log("Successfully closed the database connection.");
            }
        });
    }
}