export class StorageService {

    serialize(grid) {
        const data = {
            rows: grid.rows,
            columns: grid.columns,
            cells: []
        };

        for (let row = 0; row < grid.rows; row++) {
            data.cells[row] = [];

            for (let column = 0; column < grid.columns; column++) {
                const cell = grid.getCell(row, column);

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

    save(grid) {
        const data = this.serialize(grid);

        const json =
            JSON.stringify(data);

        localStorage.setItem(
            "gridforge-data",
            json
        );
    }

    load(grid) {
        const json =
            localStorage.getItem("gridforge-data");

        if (json === null) {
            return false;
        }

        let data;

        try {
            data = JSON.parse(json);
        } catch (error) {
            return false;
        }

        for (let row = 0; row < data.rows; row++) {
            for (let column = 0; column < data.columns; column++) {

                const savedCell =
                    data.cells[row][column];

                const cell =
                    grid.getCell(row, column);

                cell.value = savedCell.value;
                cell.formula = savedCell.formula;

                cell.format = {
                    ...savedCell.format
                };
            }
        }

        return true;
    }

}