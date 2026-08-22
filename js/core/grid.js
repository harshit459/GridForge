import { Cell } from './cell.js';

export class Grid {
    constructor(rows, cols) {
        this.rows = rows;
        this.columns = cols;

        this.cells = [];

        this.createCells();
    }

    createCells() {

        for (let row = 0; row < this.rows; row++) {
            this.cells[row] = [];
            for (let column = 0; column < this.columns; column++) {
                this.cells[row][column] = new Cell(row, column);
            }
        }

    }

    getCell(row, column) {
        if (row < 0 || row >= this.rows) {
            return null;
        }
        if (column < 0 || column >= this.columns) {
            return null;
        }

        return this.cells[row][column];
    }
}

