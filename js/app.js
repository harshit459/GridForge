import { Grid } from './models/grid.js';
import { SpreadsheetView } from './views/spreadsheetView.js';
import { SpreadsheetController } from './controllers/spreadsheetController.js';

const grid = new Grid(50, 15);

const table = document.getElementById('spreadsheet-table');

const view = new SpreadsheetView(grid, table);

view.render();

const controller = new SpreadsheetController(grid, view);