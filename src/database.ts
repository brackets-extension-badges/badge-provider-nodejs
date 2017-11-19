import Lowdb = require('lowdb');

export interface Extension {
    name: string;
    total: number;
    lastVersion: number;
    version: string;
    week: number;
}

/**
 * Database management
 */
export class Database {
    private db: Lowdb;
    private extensions: () => Lowdb.LoDashWrapper<any>;

    constructor() {
        const low = require('lowdb');
        const FileSync = require('lowdb/adapters/FileSync');
        const adapter = new FileSync('db.json');

        this.db = low(adapter);

        this.db.defaults({extensions: [], list: {}}).write();
        this.extensions = () => this.db.get('extensions');

        console.info('Database created');
    }

    /**
     * Upsert an extension, i.e update or insert
     */
    public upsert(e: Extension): void {
        let dbExtension = this.extensions().find({name: e.name});

        if (!dbExtension.value()) {
            return this.extensions().push(e).write();
        }

        dbExtension.assign({
            lastVersion: e.lastVersion,
            total: e.total,
            version: e.version,
            week: e.week,
        }).write();
    }

    /**
     * Get an extension by name
     */
    public get(name: string): Extension {
        return this.extensions().find({name}).value();
    }

    public getExtensionList(): any {
        return this.db.get('list').value();
    }

    public saveExtensionList(list: { [key: string]: number }): void {
        this.db.set('list', list).write();
    }
}
