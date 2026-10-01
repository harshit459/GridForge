import { Grid } from './grid.js';

export class Spreadsheet {
    constructor(id, name, rows, columns) {
        this.id = id;
        this.name = name;

        this.createdAt = new Date().toISOString();
        this.updatedAt = this.createdAt;

        this.grid = new Grid(rows, columns);
    }
}
