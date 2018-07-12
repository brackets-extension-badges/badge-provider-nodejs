import Loki = require('lokijs');

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
    private db: Loki;
    private extensions: Collection<any>;

    constructor() {
        this.db = new Loki('extensions.db');
        this.extensions = this.db.addCollection('extensions', {
            unique: ['name'],
        });
        console.info('Database created');
    }

    /**
     * Upsert an extension, i.e update or insert
     */
    public upsert(e: Extension): void {
        let dbExtension = this.extensions.by('name', e.name);

        if (!dbExtension) {
            // Insert
            this.extensions.insert({
                lastVersion: e.lastVersion,
                name: e.name,
                total: e.total,
                week: e.week,
            });
            return;
        }

        // Update
        dbExtension.total = e.total;
        dbExtension.week = e.week;
        dbExtension.lastVersion = e.lastVersion;
        this.extensions.update(dbExtension);
    }

    /**
     * Get an extension by name
     */
    public get(name: string): Extension {
        return this.extensions.by('name', name);
    }

    public getExtensionList(): any {
        let l = this.extensions.by('name', 'EXTENSION LIST');
        return l ? l.list : '{}';
    }

    public saveExtensionList(list: string): string {
        let n = this.extensions.by('name', 'EXTENSION LIST');
        if (n == null) {
            this.extensions.insert({list, name: 'EXTENSION LIST'});
            return;
        }
        n.list = list;
        this.extensions.update(n);
    }
}
