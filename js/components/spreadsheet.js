export function renderSpreadsheet(grid) {
    const table = document.getElementById('spreadsheet-table');
    const nameBox = document.getElementById('name-box');

    let selectedCell = null;
    let isEditing = false;
    let originalValue = "";

    const rows = grid.rows;
    const columns = grid.columns;

    const headerRow = document.createElement('tr');
    const emptyHeaderCell = document.createElement('th');
    headerRow.appendChild(emptyHeaderCell);
    for (let column = 0; column < columns; column++) {
        const th = document.createElement('th');
        const colName = String.fromCharCode(65 + column);
        th.textContent = colName;
        headerRow.appendChild(th);
    }
    table.appendChild(headerRow);

    for (let row = 0; row < rows; row++) {
        const tableRow = document.createElement('tr');
        const rowHeaderCell = document.createElement('th');
        rowHeaderCell.textContent = row + 1;
        tableRow.appendChild(rowHeaderCell);

        for (let column = 0; column < columns; column++) {

            const cellData = grid.getCell(row, column);

            const cell = document.createElement('td');
            cell.classList.add('spreadsheet-cell');

            cell.dataset.row = cellData.row;
            cell.dataset.column = cellData.column;

            const columnName = String.fromCharCode(65 + cellData.column);
            const rowName = cellData.row + 1;
            cell.dataset.address = columnName + rowName;

            tableRow.appendChild(cell);
        }
        table.appendChild(tableRow);
    }

    function selectCell(cell) {

        if (selectedCell !== null) {
            selectedCell.classList.remove('selected-cell');
            selectedCell.contentEditable = false;
        }

        selectedCell = cell;
        selectedCell.classList.add('selected-cell');

        nameBox.value = selectedCell.dataset.address;
    }

    function getCellElement(row, column) {
        return document.querySelector(
            `[data-row="${row}"][data-column="${column}"]`
        );
    }

    table.addEventListener("input", function (event) {
        const cell = event.target;

        if (!cell.classList.contains("spreadsheet-cell")) {
            return;
        }

        const row = Number(cell.dataset.row);
        const column = Number(cell.dataset.column);

        const cellData = grid.getCell(row, column);

        cellData.value = cell.textContent;
    });

    table.addEventListener('click', function (event) {

        const cell = event.target;

        if (!cell.classList.contains('spreadsheet-cell')) {
            return;
        }

        selectCell(cell);
    });

    document.addEventListener('keydown', function (event) {

        if (selectedCell === null) {
            return;
        }

        if (event.key.length === 1 && !isEditing) {

            event.preventDefault();

            isEditing = true;
            originalValue = selectedCell.textContent;
            selectedCell.contentEditable = true;
            selectedCell.textContent = event.key;
            selectedCell.focus();

            const range = document.createRange();
            const selection = window.getSelection();

            range.selectNodeContents(selectedCell);
            range.collapse(false);

            selection.removeAllRanges();
            selection.addRange(range);
            
            return;
        }

        if (event.key === "Escape") {

            if (!isEditing) {
                return;
            }

            event.preventDefault();

            selectedCell.textContent = originalValue;

            const row =
                Number(selectedCell.dataset.row);

            const column =
                Number(selectedCell.dataset.column);

            const cellData =
                grid.getCell(row, column);

            cellData.value = originalValue;

            selectedCell.contentEditable = false;

            isEditing = false;

            return;
        }

        if (event.key === "Enter") {

            event.preventDefault();


            // Finish editing

            if (isEditing) {

                isEditing = false;

                selectedCell.contentEditable = false;
            }


            // Move down

            const row =
                Number(selectedCell.dataset.row);

            const column =
                Number(selectedCell.dataset.column);

            const nextRow = row + 1;

            const nextCellData =
                grid.getCell(nextRow, column);

            if (nextCellData === null) {
                return;
            }

            const nextCellElement =
                getCellElement(nextRow, column);

            if (nextCellElement !== null) {
                selectCell(nextCellElement);
            }

            return;
        }

        if (
            event.key !== 'ArrowUp' &&
            event.key !== 'ArrowDown' &&
            event.key !== 'ArrowLeft' &&
            event.key !== 'ArrowRight'
        ) {
            return;
        }

        if (isEditing) {
            return;
        }

        event.preventDefault();

        let row = Number(selectedCell.dataset.row);
        let column = Number(selectedCell.dataset.column);

        if (event.key === 'ArrowUp') {
            row--;
        }

        if (event.key === 'ArrowDown') {
            row++;
        }

        if (event.key === 'ArrowLeft') {
            column--;
        }

        if (event.key === 'ArrowRight') {
            column++;
        }

        const nextCellData = grid.getCell(row, column);
        if (nextCellData === null) {
            return;
        }

        const nextCellElement = getCellElement(row, column);

        if (nextCellElement !== null) {
            selectCell(nextCellElement);
        }

    });

}