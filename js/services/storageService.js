import { Spreadsheet } from '../models/spreadsheet.js';

export class StorageService {

    serialize(spreadsheet) {
        const data = {
            id: spreadsheet.id,
            name: spreadsheet.name,
            createdAt: spreadsheet.createdAt,
            updatedAt: spreadsheet.updatedAt,

            rows: spreadsheet.grid.rows,
            columns: spreadsheet.grid.columns,

            cells: []
        };

        for (let row = 0; row < spreadsheet.grid.rows; row++) {
            data.cells[row] = [];

            for (let column = 0; column < spreadsheet.grid.columns; column++) {
                const cell = spreadsheet.grid.getCell(row, column);

                data.cells[row][column] = {
                    value: cell.value,
                    formula: cell.formula,
                    format: {
                        ...cell.format
                    }
                };
            }
        }

        return data;
    }

    deserialize(data) {
        const spreadsheet = new Spreadsheet(
            data.id,
            data.name,
            data.rows,
            data.columns
        );

        spreadsheet.createdAt = data.createdAt;
        spreadsheet.updatedAt = data.updatedAt;

        for (let row = 0; row < data.rows; row++) {
            for (let column = 0; column < data.columns; column++) {

                const savedCell = data.cells[row][column];

                const cell =
                    spreadsheet.grid.getCell(row, column);

                cell.value = savedCell.value;
                cell.formula = savedCell.formula;

                cell.format = {
                    ...savedCell.format
                };
            }
        }

        return spreadsheet;
    }

    save(spreadsheet) {

        spreadsheet.updatedAt = new Date().toISOString();

        const spreadsheets =
            this.getSpreadsheets();

        const data =
            this.serialize(spreadsheet);

        const index =
            spreadsheets.findIndex(
                item => item.id === spreadsheet.id
            );

        if (index === -1) {
            spreadsheets.push(data);
        } else {
            spreadsheets[index] = data;
        }

        localStorage.setItem(
            "gridforge-data",
            JSON.stringify({
                spreadsheets: spreadsheets
            })
        );
    }

    loadSpreadsheet(id) {
        const data = this.getSpreadsheet(id);

        if (data === null) {
            return null;
        }

        return this.deserialize(data);
    }

    getSpreadsheets() {
        const json =
            localStorage.getItem("gridforge-data");

        if (json === null) {
            return [];
        }

        try {
            const data = JSON.parse(json);

            return data.spreadsheets || [];
        } catch (error) {
            return [];
        }
    }

    getSpreadsheet(id) {
        const spreadsheets = this.getSpreadsheets();

        return spreadsheets.find(
            spreadsheet => spreadsheet.id === id
        ) || null;
    }

    deleteSpreadsheet(id) {
        const spreadsheets = this.getSpreadsheets();

        const filtered =
            spreadsheets.filter(
                spreadsheet => spreadsheet.id !== id
            );

        localStorage.setItem(
            "gridforge-data",
            JSON.stringify({
                spreadsheets: filtered
            })
        );
    }

    renameSpreadsheet(id, newName) {
        const spreadsheets = this.getSpreadsheets();

        const spreadsheet =
            spreadsheets.find(
                spreadsheet => spreadsheet.id === id
            );

        if (spreadsheet === undefined) {
            return false;
        }

        spreadsheet.name = newName;
        spreadsheet.updatedAt = new Date().toISOString();

        localStorage.setItem(
            "gridforge-data",
            JSON.stringify({
                spreadsheets: spreadsheets
            })
        );

        return true;
    }

}