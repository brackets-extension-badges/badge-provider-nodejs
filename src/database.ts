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
            unique: ['name'],
        });
        console.info('Database created');
    }

    public upsert(e: Extension): void {
        let n = this.extensions.by('name', e.name);

        if (n == null) {
            // Insert
            this.extensions.insert({
                lastVersionDownloads: e.lastVersionDownloads,
                name: e.name,
                totalDownloads: e.totalDownloads,
                weekDownloads: e.weekDownloads,
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
        let l = this.extensions.by('name', 'EXTENSION LIST');
        if (l == null) {
            return '{}';
        }
        return this.extensions.by('name', 'EXTENSION LIST').list;
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
