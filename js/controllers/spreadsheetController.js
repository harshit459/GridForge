export class SpreadsheetController {

    constructor(grid, view, dependencyGraph, recalculationService) {
        this.grid = grid;
        this.view = view;
        this.dependencyGraph = dependencyGraph;
        this.recalculationService = recalculationService;

        this.selectedCell = null;

        this.isEditing = false;
        this.editor = null;
        this.originalValue = "";
        this.editingSource = null;

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

            this.startEditing(cellData.value, "cell");
        });

        document.addEventListener('keydown', (event) => {

            if (this.selectedCell === null) {
                return;
            }

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
                this.startEditing(event.key, "cell");

                return;
            }

            if (this.isEditing) {
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

        this.view.formulaInput.addEventListener('focus', () => {

            if (this.selectedCell === null || this.isEditing) {
                return;
            }
            this.startEditing(this.view.formulaInput.value, "formula");
        });
    }

    selectCell(cell) {

        this.selectedCell = cell;

        this.view.selectCell(cell);

        const row = Number(cell.dataset.row);
        const column = Number(cell.dataset.column);

        const cellData = this.grid.getCell(row, column);

        this.view.setFormulaInput(cellData.value);
    }

    startEditing(initialValue, source) {

        if (this.selectedCell === null || this.isEditing) {
            return;
        }

        this.isEditing = true;
        this.editingSource = source;

        const row = Number(this.selectedCell.dataset.row);
        const column = Number(this.selectedCell.dataset.column);

        const cellData = this.grid.getCell(row, column);

        this.originalValue = cellData.value;

        if (source === "cell") {

            this.editor =
                this.view.createEditor(
                    this.selectedCell,
                    initialValue
                );

            this.editor.focus();

            this.editor.setSelectionRange(
                this.editor.value.length,
                this.editor.value.length
            );
        }

        if (source === "formula") {

            this.view.focusFormulaInput();
        }
    }

    finishEditing() {

        if (!this.isEditing || this.selectedCell === null) {
            return;
        }

        const row = Number(this.selectedCell.dataset.row);
        const column = Number(this.selectedCell.dataset.column);

        const cellData = this.grid.getCell(row, column);

        let newValue;

        if (this.editingSource === "cell") {
            newValue = this.editor.value;
        }

        if (this.editingSource === "formula") {
            newValue = this.view.formulaInput.value;
        }

        const address = this.selectedCell.dataset.address;

        const affectedCells =
            this.recalculationService.setCellContent(
                address,
                newValue
            );

        this.view.updateCellDisplay(cellData);

        for (const affectedAddress of affectedCells) {

            const affectedCell =
                this.recalculationService.getCell(
                    affectedAddress
                );

            if (affectedCell === null) {
                continue;
            }

            this.view.updateCellDisplay(affectedCell);
        }

        // this.view.setFormulaInput(newValue);

        this.editor = null;
        this.isEditing = false;
        this.editingSource = null;
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
        this.view.setFormulaInput(this.originalValue);

        this.editor = null;
        this.isEditing = false;
        this.editingSource = null;
        this.originalValue = "";
    }
} 
