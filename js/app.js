import { Grid } from './core/grid.js';
import { renderSpreadsheet } from './components/spreadsheet.js';

const grid = new Grid(3, 4);
window.grid = grid;
renderSpreadsheet(grid);