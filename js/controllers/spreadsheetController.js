export class SpreadsheetController {

    constructor(grid, view) {
        this.grid = grid;
        this.view = view;

        this.selectedCell = null;

        this.isEditing = false;
        this.editor = null;
        this.originalValue = "";

        this.setupEvents();
    }

    setupEvents() {

        this.view.table.addEventListener('click', (event) => {

            const cell = event.target;

            if (!cell.classList.contains('spreadsheet-cell')) {
                return;
            }

            if (this.isEditing && cell !== this.selectedCell) {
                this.finishEditing();
            }

            this.selectCell(cell);

        });

        this.view.table.addEventListener('dblclick', (event) => {

            const cell = event.target;

            if (!cell.classList.contains('spreadsheet-cell')) {
                return;
            }

            this.selectCell(cell);

            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData = this.grid.getCell(row, column);

            this.startEditing(cellData.value);
        });

        document.addEventListener('keydown', (event) => {

            if (this.selectedCell === null) {
                return;
            }

            const row = Number(this.selectedCell.dataset.row);
            const column = Number(this.selectedCell.dataset.column);

            let nextRow = row;
            let nextColumn = column;

            if (event.key === "Enter") {

                event.preventDefault();

                if (this.isEditing) {
                    this.finishEditing();
                }

                const row =
                    Number(this.selectedCell.dataset.row);

                const column =
                    Number(this.selectedCell.dataset.column);

                const nextCell =
                    this.grid.getCell(row + 1, column);

                if (nextCell === null) {
                    return;
                }

                const nextCellElement =
                    this.view.getCellElement(
                        nextCell.row,
                        nextCell.column
                    );

                this.selectCell(nextCellElement);

                return;
            }

            if (event.key === "Escape") {
                if (!this.isEditing) {
                    return;
                }

                event.preventDefault();
                this.cancelEditing();

                return;
            }

            if (event.key.length === 1 && !this.isEditing) {

                event.preventDefault();
                this.startEditing(event.key);

                return;
            }

            if (this.isEditing) {
                return;
            }

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

    startEditing(intialvalue) {

        if (this.selectedCell === null || this.isEditing) {
            return;
        }

        const row = Number(this.selectedCell.dataset.row);
        const column = Number(this.selectedCell.dataset.column);

        const cellData = this.grid.getCell(row, column);

        this.originalValue = cellData.value;

        this.editor = this.view.createEditor(
            this.selectedCell,
            intialvalue
        );

        this.isEditing = true;

        this.editor.focus();

        this.editor.setSelectionRange(
            this.editor.value.length,
            this.editor.value.length
        );
    }

    finishEditing() {

        if (!this.isEditing || this.selectedCell === null) {
            return;
        }

        const row = Number(this.selectedCell.dataset.row);
        const column = Number(this.selectedCell.dataset.column);

        const cellData = this.grid.getCell(row, column);

        cellData.value = this.editor.value;

        this.view.updateCellDisplay(cellData);

        this.editor = null;
        this.isEditing = false;
        this.originalValue = "";
    }

    cancelEditing() {

        if (!this.isEditing || this.selectedCell === null) {
            return;
        }

        const row = Number(this.selectedCell.dataset.row);
        const column = Number(this.selectedCell.dataset.column);

        const cellData = this.grid.getCell(row, column);

        cellData.value = this.originalValue;

        this.view.updateCellDisplay(cellData);

        this.editor = null;
        this.isEditing = false;
        this.originalValue = "";
    }
} 
