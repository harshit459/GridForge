import { Spreadsheet } from './models/spreadsheet.js';
import { SpreadsheetView } from './views/spreadsheetView.js';
import { SpreadsheetController } from './controllers/spreadsheetController.js';
import { DependencyGraph } from './services/dependencyGraph.js';
import { RecalculationService } from './services/recalculationService.js';
import { Toolbar } from './views/toolbar.js';
import { HistoryManager } from './services/historyManager.js';
import { StorageService } from './services/storageService.js';

const params = new URLSearchParams(window.location.search);

const spreadsheetId = params.get("id");

const storageService = new StorageService();

const loadedSpreadsheet =
    spreadsheetId === null
        ? null
        : storageService.loadSpreadsheet(spreadsheetId);

if (spreadsheetId !== null && loadedSpreadsheet === null) {
    window.location.href = "dashboard.html";
}

const spreadsheet =
    loadedSpreadsheet !== null
        ? loadedSpreadsheet
        : new Spreadsheet(
            crypto.randomUUID(),
            "Untitled Spreadsheet",
            50,
            10
        );

const spreadsheetTitle =
    document.getElementById("spreadsheet-title");

spreadsheetTitle.textContent =
    spreadsheet.name;

const toolbarElement = document.getElementById("toolbar");

const toolbar = new Toolbar(toolbarElement);

toolbar.render();

const grid = spreadsheet.grid;

const table = document.getElementById('spreadsheet-table');
const formulaInput = document.getElementById('formula-input');
const nameBox = document.getElementById('name-box');

const view = new SpreadsheetView(grid, table, formulaInput, nameBox);

view.render();

const dependencyGraph = new DependencyGraph();

const recalculationService = new RecalculationService(grid, dependencyGraph);

const historyManager = new HistoryManager();

const controller = new SpreadsheetController(spreadsheet, view, toolbar, dependencyGraph, recalculationService, historyManager, storageService);