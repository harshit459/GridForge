export class SpreadsheetView {

    constructor(grid, table) {
        this.grid = grid;
        this.table = table;
    }

    render() {

        this.table.innerHTML = "";

        this.createColumnHeaders();

        for (let row = 0; row < this.grid.rows; row++) {

            const tableRow = document.createElement("tr");

            const rowHeader = document.createElement("th");
            rowHeader.textContent = row + 1;

            tableRow.appendChild(rowHeader);

            for (let column = 0; column < this.grid.columns; column++) {

                const cell = this.createCell(row, column);

                tableRow.appendChild(cell);
            }

            this.table.appendChild(tableRow);
        }
    }

    createColumnHeaders() {

        const headerRow = document.createElement("tr");

        const emptyHeader = document.createElement("th");

        headerRow.appendChild(emptyHeader);

        for (let column = 0; column < this.grid.columns; column++) {

            const header = document.createElement("th");

            header.textContent =
                String.fromCharCode(65 + column);

            headerRow.appendChild(header);
        }

        this.table.appendChild(headerRow);
    }

    createCell(row, column) {

        const cellData = this.grid.getCell(row, column);

        const cell = document.createElement("td");

        cell.classList.add("spreadsheet-cell");

        cell.dataset.row = cellData.row;
        cell.dataset.column = cellData.column;

        const columnName =
            String.fromCharCode(65 + column);

        const rowName = row + 1;

        cell.dataset.address =
            columnName + rowName;

        cell.textContent = cellData.value;

        return cell;
    }

    getCellElement(row, column) {

        return this.table.querySelector(
            `[data-row="${row}"][data-column="${column}"]`
        );
    }

    selectCell(cell) {

        const previousCell =
            this.table.querySelector(".selected-cell");

        if (previousCell !== null) {
            previousCell.classList.remove("selected-cell");
        }

        cell.classList.add("selected-cell");
    }

    updateCellDisplay(cellData) {

        const cell = this.getCellElement(
            cellData.row,
            cellData.column
        );

        if (cell === null) {
            return;
        }

        cell.textContent = cellData.value;
    }
}