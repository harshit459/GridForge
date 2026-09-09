export class AddressUtils {

    static columnToName(column) {

        let name = "";

        column++;

        while (column > 0) {

            const remainder = (column - 1) % 26;

            name =
                String.fromCharCode(65 + remainder) + name;

            column =
                Math.floor((column - 1) / 26);
        }

        return name;
    }

    static columnFromName(columnName) {

        let column = 0;

        for (const character of columnName) {

            column =
                column * 26 +
                (character.charCodeAt(0) - 64);
        }

        return column - 1;
    }

    static parseAddress(address) {

        const match =
            address.match(/^([A-Z]+)([0-9]+)$/);

        if (match === null) {
            return null;
        }

        return {
            column: this.columnFromName(match[1]),
            row: Number(match[2]) - 1
        };
    }

    static getRangeCells(startAddress, endAddress) {

        const start =
            this.parseAddress(startAddress);

        const end =
            this.parseAddress(endAddress);

        if (start === null || end === null) {
            return [];
        }

        const cells = [];

        for (let row = start.row; row <= end.row; row++) {
            for (let column = start.column; column <= end.column; column++) {

                cells.push({
                    row: row,
                    column: column
                });
            }
        }

        return cells;
    }

}