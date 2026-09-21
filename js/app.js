import { Grid } from './models/grid.js';
import { SpreadsheetView } from './views/spreadsheetView.js';
import { SpreadsheetController } from './controllers/spreadsheetController.js';
import { DependencyGraph } from './services/dependencyGraph.js';
import { RecalculationService } from './services/recalculationService.js';
import { Toolbar } from './views/toolbar.js';
import { HistoryManager } from './services/historyManager.js';
import { StorageService } from './services/storageService.js';

const toolbarElement = document.getElementById("toolbar");

const toolbar = new Toolbar(toolbarElement);

toolbar.render();

const grid = new Grid(50, 10);

const table = document.getElementById('spreadsheet-table');
const formulaInput = document.getElementById('formula-input');

const view = new SpreadsheetView(grid, table, formulaInput);

view.render();

const dependencyGraph = new DependencyGraph();

const recalculationService = new RecalculationService(grid, dependencyGraph);

const historyManager = new HistoryManager();

const storageService = new StorageService();

const controller = new SpreadsheetController(grid, view, toolbar, dependencyGraph, recalculationService, historyManager, storageService);