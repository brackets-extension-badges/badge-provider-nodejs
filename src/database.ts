import Loki = require('lokijs');

export interface Extension {
    name: string;
    totalDownloads: number;
    lastVersionDownloads: number;
    weekDownloads: number;
}

export class Database {
    private db: Loki;
    public extensions: LokiCollection<any>;

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

    public getExtensionList(): string {
        return this.extensions.by('name', 'EXTENSION LIST', ).list;
    }

    public saveExtensionList(list: string): string {
        let n = this.extensions.by('name', 'EXTENSION LIST');
        if (n == null) {
            this.extensions.insert({ name: 'EXTENSION LIST', list: list});
            return;
        }

        n.list = list;
        this.extensions.update(n);
    }
}