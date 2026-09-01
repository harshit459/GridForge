export class SpreadsheetController {

    constructor(grid, view) {
        this.grid = grid;
        this.view = view;

        this.selectedCell = null;

        this.setupEvents();
    }

    setupEvents() {

        this.view.table.addEventListener('click', (event) => {

            const cell = event.target;

            if (!cell.classList.contains('spreadsheet-cell')) {
                return;
            }

            this.selectCell(cell);

        });

        document.addEventListener('keydown', (event) => {

            if (this.selectedCell === null) {
                return;
            }

            const row = Number(this.selectedCell.dataset.row);
            const column = Number(this.selectedCell.dataset.column);

            let nextRow = row;
            let nextColumn = column;


            if (event.key === 'ArrowRight') {
                nextColumn++;
            }

            if (event.key === 'ArrowLeft') {
                nextColumn--;
            }

            if (event.key === 'ArrowUp') {
                nextRow--;
            }

            if (event.key === 'ArrowDown') {
                nextRow++;
            }

            if (nextRow === row && nextColumn === column) {
                return;
            }


            const nextCell =
                this.grid.getCell(nextRow, nextColumn);

            if (nextCell === null) {
                return;
            }


            const nextCellElement =
                this.view.getCellElement(
                    nextCell.row,
                    nextCell.column
                );

            this.selectCell(nextCellElement);
        });
    }

    selectCell(cell) {

        this.selectedCell = cell;

        this.view.selectCell(cell);
    }
} 