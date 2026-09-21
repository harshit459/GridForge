export class SpreadsheetController {

    constructor(grid, view, toolbar, dependencyGraph, recalculationService, historyManager, storageService) {
        this.grid = grid;
        this.view = view;
        this.toolbar = toolbar;
        this.dependencyGraph = dependencyGraph;
        this.recalculationService = recalculationService;

        this.historyManager = historyManager;
        this.storageService = storageService;

        this.selectedCell = null;
        this.selectedCells = [];
        this.selectionStart = null;

        this.clipboard = null;

        this.isEditing = false;
        this.editor = null;
        this.originalValue = "";
        this.originalFormula = "";
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

            if (event.shiftKey && this.selectionStart !== null) {
                this.selectRange(this.selectionStart, cell);
                return;
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

            if (event.ctrlKey && event.key.toLowerCase() === "c") {
                event.preventDefault();
                this.copySelection();
                return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "v") {
                event.preventDefault();
                this.pasteSelection();
                return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "z") {
                event.preventDefault();

                this.historyManager.undo();

                return;
            }

            if (event.ctrlKey && event.key.toLowerCase() === "y") {
                event.preventDefault();

                this.historyManager.redo();

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

                this.scrollSelectedCellIntoView();

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

            if (
                !this.isEditing &&
                (
                    event.key === "ArrowUp" ||
                    event.key === "ArrowDown" ||
                    event.key === "ArrowLeft" ||
                    event.key === "ArrowRight"
                )
            ) {
                event.preventDefault();
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

            this.scrollSelectedCellIntoView();
        });

        this.view.formulaInput.addEventListener('focus', () => {

            if (this.selectedCell === null || this.isEditing) {
                return;
            }
            this.startEditing(this.view.formulaInput.value, "formula");
        });

        this.toolbar.boldButton.addEventListener(
            "click",
            () => {
                this.toggleBold();
            }
        );

        this.toolbar.italicButton.addEventListener(
            "click",
            () => {
                this.toggleItalic();
            }
        );

        this.toolbar.fontSizeSelect.addEventListener(
            "change",
            () => {
                this.setFontSize(
                    this.toolbar.fontSizeSelect.value
                );
            }
        );

        this.toolbar.alignmentSelect.addEventListener(
            "change",
            () => {
                this.setTextAlign(
                    this.toolbar.alignmentSelect.value
                );
            }
        );

        this.toolbar.saveButton.addEventListener("click", () => {
            this.storageService.save(this.grid);
        });

        this.toolbar.loadButton.addEventListener("click", () => {

            const loaded =
                this.storageService.load(this.grid);

            if (!loaded) {
                return;
            }

            this.rebuildDependencies();

            this.view.render();
        });

    }

    selectCell(cell) {

        this.selectedCell = cell;
        this.selectedCells = [cell];
        this.selectionStart = cell;

        this.view.selectCell(cell);

        this.view.setNameBox(
            cell.dataset.address
        );

        const row = Number(cell.dataset.row);
        const column = Number(cell.dataset.column);

        const cellData = this.grid.getCell(row, column);

        this.view.setFormulaInput(cellData.value);

        this.updateToolbarState();

    }

    selectRange(startCell, endCell) {
        const startRow = Number(startCell.dataset.row);
        const startColumn = Number(startCell.dataset.column);

        const endRow = Number(endCell.dataset.row);
        const endColumn = Number(endCell.dataset.column);

        const minRow = Math.min(startRow, endRow);
        const maxRow = Math.max(startRow, endRow);

        const minColumn = Math.min(startColumn, endColumn);
        const maxColumn = Math.max(startColumn, endColumn);

        const cells = [];

        for (let row = minRow; row <= maxRow; row++) {
            for (
                let column = minColumn;
                column <= maxColumn;
                column++
            ) {
                const cell =
                    this.view.getCellElement(row, column);

                if (cell === null) continue;

                cells.push(cell);
            }
        }

        this.selectedCells = cells;

        this.view.selectCells(cells);

        const startAddress =
            this.view.getCellElement(minRow, minColumn)
                .dataset.address;

        const endAddress =
            this.view.getCellElement(maxRow, maxColumn)
                .dataset.address;

        if (startAddress === endAddress) {
            this.view.setNameBox(startAddress);
        } else {
            this.view.setNameBox(
                `${startAddress}:${endAddress}`
            );
        }

        this.updateToolbarState();

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
        this.originalFormula = cellData.formula;

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

        const oldValue = cellData.value;
        const oldFormula = cellData.formula;

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

        const newFormula = cellData.formula;
        const updatedValue = cellData.value;

        const action = {
            undo: () => {
                const content =
                    oldFormula !== ""
                        ? oldFormula
                        : oldValue;

                const affectedCells =
                    this.recalculationService.setCellContent(
                        address,
                        content
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

                this.view.setFormulaInput(
                    oldFormula || oldValue
                );
            },

            redo: () => {
                const content =
                    newFormula !== ""
                        ? newFormula
                        : updatedValue;

                const affectedCells =
                    this.recalculationService.setCellContent(
                        address,
                        content
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

                this.view.setFormulaInput(
                    newFormula || updatedValue
                );
            }
        };

        this.historyManager.record(action);

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

        this.stopEditing();
    }

    cancelEditing() {

        if (!this.isEditing || this.selectedCell === null) {
            return;
        }

        const row = Number(this.selectedCell.dataset.row);
        const column = Number(this.selectedCell.dataset.column);

        const cellData = this.grid.getCell(row, column);

        cellData.value = this.originalValue;
        cellData.formula = this.originalFormula;

        this.view.updateCellDisplay(cellData);

        this.view.setFormulaInput(
            this.originalFormula || this.originalValue
        );

        this.stopEditing();
    }

    stopEditing() {
        this.editor = null;
        this.isEditing = false;
        this.editingSource = null;
        this.originalValue = "";
        this.originalFormula = "";
    }

    toggleBold() {
        if (this.selectedCells.length === 0) return;

        const allBold =
            this.selectedCells.every(cell => {
                const row = Number(cell.dataset.row);
                const column = Number(cell.dataset.column);

                const cellData =
                    this.grid.getCell(row, column);

                return cellData.format.bold;
            });

        const previousFormatting = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            previousFormatting.push({
                cell: cell,
                value: cellData.format.bold
            });
        }

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            cellData.format.bold = !allBold;

            this.view.applyFormatting(
                cell,
                cellData
            );
        }

        const newFormatting = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            newFormatting.push({
                cell: cell,
                value: cellData.format.bold
            });
        }

        this.recordFormattingAction(
            "bold",
            previousFormatting,
            newFormatting
        );

        this.toolbar.boldButton.classList.toggle(
            "active",
            !allBold
        );
    }

    toggleItalic() {
        if (this.selectedCells.length === 0) return;

        const allItalic =
            this.selectedCells.every(cell => {
                const row = Number(cell.dataset.row);
                const column = Number(cell.dataset.column);

                const cellData =
                    this.grid.getCell(row, column);

                return cellData.format.italic;
            });

        const previousFormatting = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            previousFormatting.push({
                cell: cell,
                value: cellData.format.italic
            });
        }

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            cellData.format.italic = !allItalic;

            this.view.applyFormatting(
                cell,
                cellData
            );
        }

        const newFormatting = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            newFormatting.push({
                cell: cell,
                value: cellData.format.italic
            });
        }

        this.recordFormattingAction(
            "italic",
            previousFormatting,
            newFormatting
        );

        this.toolbar.italicButton.classList.toggle(
            "active",
            !allItalic
        );
    }

    setFontSize(size) {
        if (this.selectedCells.length === 0) return;

        const fontSize = Number(size);

        const previousFormatting = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            previousFormatting.push({
                cell: cell,
                value: cellData.format.fontSize
            });
        }

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            cellData.format.fontSize = fontSize;

            this.view.applyFormatting(
                cell,
                cellData
            );
        }

        const newFormatting = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            newFormatting.push({
                cell: cell,
                value: cellData.format.fontSize
            });
        }

        this.recordFormattingAction(
            "fontSize",
            previousFormatting,
            newFormatting
        );

    }

    setTextAlign(alignment) {
        if (this.selectedCells.length === 0) return;

        const previousFormatting = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            previousFormatting.push({
                cell: cell,
                value: cellData.format.textAlign
            });
        }

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            cellData.format.textAlign = alignment;

            this.view.applyFormatting(
                cell,
                cellData
            );
        }

        const newFormatting = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            newFormatting.push({
                cell: cell,
                value: cellData.format.textAlign
            });
        }

        this.recordFormattingAction(
            "textAlign",
            previousFormatting,
            newFormatting
        );

    }

    getCommonFormatValue(property) {
        if (this.selectedCells.length === 0) {
            return null;
        }

        const firstCell = this.selectedCells[0];

        const firstRow = Number(firstCell.dataset.row);
        const firstColumn = Number(firstCell.dataset.column);

        const firstCellData =
            this.grid.getCell(firstRow, firstColumn);

        const firstValue =
            firstCellData.format[property];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            if (cellData.format[property] !== firstValue) {
                return null;
            }
        }

        return firstValue;
    }

    updateToolbarState() {
        if (this.selectedCells.length === 0) return;

        const allBold =
            this.selectedCells.every(cell => {
                const row = Number(cell.dataset.row);
                const column = Number(cell.dataset.column);

                const cellData =
                    this.grid.getCell(row, column);

                return cellData.format.bold;
            });

        const allItalic =
            this.selectedCells.every(cell => {
                const row = Number(cell.dataset.row);
                const column = Number(cell.dataset.column);

                const cellData =
                    this.grid.getCell(row, column);

                return cellData.format.italic;
            });

        const commonFontSize =
            this.getCommonFormatValue("fontSize");

        const commonAlignment =
            this.getCommonFormatValue("textAlign");

        this.toolbar.boldButton.classList.toggle(
            "active",
            allBold
        );

        this.toolbar.italicButton.classList.toggle(
            "active",
            allItalic
        );

        if (commonFontSize === null) {
            this.toolbar.fontSizeSelect.value = "mixed";
        } else {
            this.toolbar.fontSizeSelect.value =
                commonFontSize;
        }

        if (commonAlignment === null) {
            this.toolbar.alignmentSelect.value = "mixed";
        } else {
            this.toolbar.alignmentSelect.value =
                commonAlignment;
        }
    }

    recordFormattingAction(property, previousFormatting, newFormatting) {
        const action = {
            undo: () => {
                for (const item of previousFormatting) {
                    const row = Number(item.cell.dataset.row);
                    const column = Number(item.cell.dataset.column);

                    const cellData =
                        this.grid.getCell(row, column);

                    cellData.format[property] = item.value;

                    this.view.applyFormatting(
                        item.cell,
                        cellData
                    );
                }

                this.updateToolbarState();
            },

            redo: () => {
                for (const item of newFormatting) {
                    const row = Number(item.cell.dataset.row);
                    const column = Number(item.cell.dataset.column);

                    const cellData =
                        this.grid.getCell(row, column);

                    cellData.format[property] = item.value;

                    this.view.applyFormatting(
                        item.cell,
                        cellData
                    );
                }

                this.updateToolbarState();
            }
        };

        this.historyManager.record(action);
    }

    copySelection() {
        if (this.selectedCells.length === 0) return;

        const copiedCells = [];

        for (const cell of this.selectedCells) {
            const row = Number(cell.dataset.row);
            const column = Number(cell.dataset.column);

            const cellData =
                this.grid.getCell(row, column);

            copiedCells.push({
                row: row,
                column: column,
                value: cellData.value,
                formula: cellData.formula,
                format: {
                    ...cellData.format
                }
            });
        }

        this.clipboard = {
            cells: copiedCells
        };

    }

    pasteSelection() {
        if (
            this.clipboard === null ||
            this.selectedCell === null
        ) {
            return;
        }

        const destinationRow =
            Number(this.selectedCell.dataset.row);

        const destinationColumn =
            Number(this.selectedCell.dataset.column);

        const sourceCells =
            this.clipboard.cells;

        const previousStates = [];

        const firstSourceCell =
            sourceCells[0];

        const rowOffset =
            destinationRow - firstSourceCell.row;

        const columnOffset =
            destinationColumn - firstSourceCell.column;

        for (const sourceCell of sourceCells) {

            const targetRow =
                sourceCell.row + rowOffset;

            const targetColumn =
                sourceCell.column + columnOffset;

            const targetCell =
                this.grid.getCell(
                    targetRow,
                    targetColumn
                );

            if (targetCell === null) {
                continue;
            }

            previousStates.push({
                cell: targetCell,
                value: targetCell.value,
                formula: targetCell.formula,
                format: {
                    ...targetCell.format
                }
            });

            const targetElement =
                this.view.getCellElement(
                    targetRow,
                    targetColumn
                );

            if (sourceCell.formula !== "") {

                const shiftedFormula =
                    this.recalculationService.formulaEngine
                        .shiftReferences(
                            sourceCell.formula,
                            rowOffset,
                            columnOffset
                        );

                targetCell.formula = shiftedFormula;

                targetCell.value =
                    this.recalculationService.formulaEngine.evaluate(
                        shiftedFormula,
                        this.grid
                    );

                const references =
                    this.recalculationService.formulaEngine
                        .getReferences(shiftedFormula);

                this.dependencyGraph.setDependencies(
                    targetElement.dataset.address,
                    references
                );

            } else {

                targetCell.formula = "";
                targetCell.value = sourceCell.value;

                // NEW: remove old dependencies
                this.dependencyGraph.setDependencies(
                    targetElement.dataset.address,
                    []
                );
            }

            targetCell.format = {
                ...sourceCell.format
            };

            if (targetElement !== null) {
                this.view.applyFormatting(
                    targetElement,
                    targetCell
                );

                this.view.updateCellDisplay(
                    targetCell
                );
            }
        }

        const newStates = [];

        for (const sourceCell of sourceCells) {

            const targetRow =
                sourceCell.row + rowOffset;

            const targetColumn =
                sourceCell.column + columnOffset;

            const targetCell =
                this.grid.getCell(
                    targetRow,
                    targetColumn
                );

            if (targetCell === null) {
                continue;
            }

            newStates.push({
                cell: targetCell,
                value: targetCell.value,
                formula: targetCell.formula,
                format: {
                    ...targetCell.format
                }
            });
        }

        const action = {
            undo: () => {
                for (const state of previousStates) {
                    this.restoreCellState(state);
                }
            },

            redo: () => {
                for (const state of newStates) {
                    this.restoreCellState(state);
                }
            }
        };

        this.historyManager.record(action);
    }

    restoreCellState(state) {
        const content =
            state.formula !== ""
                ? state.formula
                : state.value;

        const targetElement =
            this.view.getCellElement(
                state.cell.row,
                state.cell.column
            );

        if (targetElement === null) {
            return;
        }

        const affectedCells =
            this.recalculationService.setCellContent(
                targetElement.dataset.address,
                content
            );

        state.cell.format = {
            ...state.format
        };

        this.view.applyFormatting(
            targetElement,
            state.cell
        );

        this.view.updateCellDisplay(
            state.cell
        );

        for (const affectedAddress of affectedCells) {
            const affectedCell =
                this.recalculationService.getCell(
                    affectedAddress
                );

            if (affectedCell === null) {
                continue;
            }

            this.view.updateCellDisplay(
                affectedCell
            );
        }
    }

    rebuildDependencies() {
        for (let row = 0; row < this.grid.rows; row++) {
            for (let column = 0; column < this.grid.columns; column++) {

                const cell =
                    this.grid.getCell(row, column);

                const address =
                    this.view.getCellElement(row, column)
                        .dataset.address;

                if (cell.formula !== "") {

                    const references =
                        this.recalculationService
                            .formulaEngine
                            .getReferences(cell.formula);

                    this.dependencyGraph.setDependencies(
                        address,
                        references
                    );

                } else {

                    this.dependencyGraph.setDependencies(
                        address,
                        []
                    );
                }
            }
        }
    }

    scrollSelectedCellIntoView() {
        if (this.selectedCell === null) {
            return;
        }

        this.selectedCell.scrollIntoView({
            block: "nearest",
            inline: "nearest"
        });
    }

} 
