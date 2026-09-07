import { Grid } from './models/grid.js';
import { SpreadsheetView } from './views/spreadsheetView.js';
import { SpreadsheetController } from './controllers/spreadsheetController.js';
import { DependencyGraph } from './services/dependencyGraph.js';
import { RecalculationService } from './services/recalculationService.js';

const grid = new Grid(50, 15);

const table = document.getElementById('spreadsheet-table');
const formulaInput = document.getElementById('formula-input');

const view = new SpreadsheetView(grid, table, formulaInput);

view.render();

const dependencyGraph = new DependencyGraph();

const recalculationService = new RecalculationService(grid, dependencyGraph);

const controller = new SpreadsheetController(grid, view, dependencyGraph, recalculationService);