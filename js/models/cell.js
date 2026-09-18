export class Cell {
    constructor(row, column) {
        this.row = row;
        this.column = column;

        this.value = "";
        this.formula = "";

        this.format = {
            bold: false,
            italic: false,
            fontSize: 14,
            textAlign: "left"
        };
    }
}