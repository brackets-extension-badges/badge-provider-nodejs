import Loki = require('lokijs');

export interface Extension {
    name: string;
    totalDownloads: number;
    lastVersionDownloads: number;
    weekDownloads: number;
}

export class Database {
    private db: Loki;
    private extensions: LokiCollection<any>;

    constructor() {
        this.db = new Loki('extensions.db');
        this.extensions = this.db.addCollection('extensions', {
            unique: ['name']
        });
        console.log('Database created');
    }

    public upsert(e: Extension): void {
        let n = this.extensions.by('name', e.name);

        if (n == null) {
            // Insert
            this.extensions.insert({
                name: e.name,
                totalDownloads: e.totalDownloads,
                weekDownloads: e.weekDownloads,
                lastVersionDownloads: e.lastVersionDownloads,
            });
            return;
        }

        // Update
        n.totalDownloads = e.totalDownloads;
        n.weekDownloads = e.weekDownloads;
        n.lastVersionDownloads = e.lastVersionDownloads;
        this.extensions.update(n);
    }

    public get(name: string): Extension {
        return this.extensions.by('name', name);
    }
}