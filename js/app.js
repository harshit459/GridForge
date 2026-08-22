const rows = 3;
const cols = 4;

console.log(rows, cols);

const spreadsheetData = [];
for(let row=0; row<rows; row++){
    spreadsheetData[row] = [];
    for(let col=0; col<cols; col++){
        spreadsheetData[row][col] = '';
    }
}


const table = document.getElementById('spreadsheet-table');

const headerRow = document.createElement('tr');
const emptyHeaderCell = document.createElement('th');
headerRow.appendChild(emptyHeaderCell);
for(let col=0; col<cols; col++){
    const th = document.createElement('th');
    const colName = String.fromCharCode(65 + col);
    th.textContent = colName;
    headerRow.appendChild(th);
}
table.appendChild(headerRow);

for(let row=0; row<rows; row++){
    const tableRow = document.createElement('tr');
    const rowHeaderCell = document.createElement('th');
    rowHeaderCell.textContent = row + 1;
    tableRow.appendChild(rowHeaderCell);

    for(let col=0; col<cols; col++){

        const cell = document.createElement('td');
        cell.classList.add('spreadsheet-cell');
        
        cell.dataset.row = row;
        cell.dataset.col = col;
        const colName = String.fromCharCode(65 + col);
        const rowName = row + 1;
        cell.dataset.address = colName + rowName;
        
        cell.addEventListener('input', function(event){
            const row = Number(event.target.dataset.row);
            const col = Number(event.target.dataset.col);
            spreadsheetData[row][col] = event.target.textContent;
        });

        tableRow.appendChild(cell);
    }
    table.appendChild(tableRow);
}

let selectedCell = null;
const nameBox = document.getElementById('name-box');

document.addEventListener('click', function(event){

    if(!event.target.classList.contains('spreadsheet-cell')){
        return;
    }
    if(selectedCell !== null){
        selectedCell.classList.remove('selected-cell');
    }
    selectedCell = event.target;
    selectedCell.classList.add('selected-cell');
    selectedCell.contentEditable = true;
    nameBox.value = selectedCell.dataset.address;
})

document.addEventListener('keydown', function(event){
    if(selectedCell === null){
        return;
    }

    if(event.key === 'Enter'){
        console.log('Enter pressed', selectedCell.dataset.address);
        event.preventDefault();
        const row = Number(selectedCell.dataset.row);
        const col = Number(selectedCell.dataset.col);

        const nextRow = row + 1;
        const nextCell = document.querySelector(
            `[data-row="${nextRow}"][data-col="${col}"]`
        );

        if(nextCell !== null){
            selectedCell.classList.remove('selected-cell');
            selectedCell.contentEditable = false;
            selectedCell = nextCell;
            selectedCell.classList.add('selected-cell');
            selectedCell.contentEditable = true;
            nameBox.value = selectedCell.dataset.address;
        }
    }

    if(event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight'){
        event.preventDefault();
        let row = Number(selectedCell.dataset.row);
        let col = Number(selectedCell.dataset.col);

        if(event.key === 'ArrowUp')
            row--;
        if(event.key === 'ArrowDown')
            row++;
        if(event.key === 'ArrowLeft')
            col--;
        if(event.key === 'ArrowRight')
            col++;

        const nextCell = document.querySelector(
            `[data-row="${row}"][data-col="${col}"]`
        );

        if(nextCell !== null){
            selectedCell.classList.remove('selected-cell');
            selectedCell.contentEditable = false;
            selectedCell = nextCell;
            selectedCell.classList.add('selected-cell');
            selectedCell.contentEditable = true;
            nameBox.value = selectedCell.dataset.address;
        }
    }
});


const debugButton = document.getElementById("debug-button");

debugButton.addEventListener("click", function () {
    console.log(spreadsheetData);
});