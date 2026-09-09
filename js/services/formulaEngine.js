import { AddressUtils } from "../utils/addressUtils.js";

export class FormulaEngine {

    evaluate(formula, grid) {

        if (!formula.startsWith("=")) {
            return formula;
        }

        const expression =
            formula.substring(1).trim();

        return this.evaluateExpression(
            expression,
            grid
        );
    }

    evaluateExpression(expression, grid) {

        expression = expression.trim();

        const functionResult =
            this.evaluateFunction(
                expression,
                grid
            );

        if (functionResult !== null) {
            return functionResult;
        }

        if (expression.startsWith("-")) {

            const value =
                this.evaluateExpression(
                    expression.substring(1).trim(),
                    grid
                );

            if (typeof value === "string") {
                return value;
            }

            return -value;
        }

        if (
            expression.startsWith("(") &&
            expression.endsWith(")") &&
            this.hasMatchingOuterParentheses(expression)
        ) {
            expression =
                expression.substring(
                    1,
                    expression.length - 1
                ).trim();
        }

        const operators = ["+", "-", "*", "/"];

        for (const operator of operators) {

            const operatorIndex =
                this.findOperator(
                    expression,
                    operator
                );

            if (operatorIndex === -1) {
                continue;
            }

            const left =
                expression.substring(
                    0,
                    operatorIndex
                ).trim();

            const right =
                expression.substring(
                    operatorIndex + 1
                ).trim();

            if (left === "" || right === "") {
                return "#ERROR!";
            }

            const firstValue =
                this.evaluateExpression(
                    left,
                    grid
                );

            const secondValue =
                this.evaluateExpression(
                    right,
                    grid
                );

            if (
                typeof firstValue === "string" ||
                typeof secondValue === "string"
            ) {
                return "#ERROR!";
            }

            return this.calculate(
                firstValue,
                secondValue,
                operator
            );
        }

        return this.getOperandValue(
            expression,
            grid
        );
    }

    evaluateFunction(expression, grid) {

        if (
            !expression.startsWith("SUM(") ||
            !expression.endsWith(")")
        ) {
            return null;
        }

        const range =
            expression.substring(
                4,
                expression.length - 1
            );

        const parts = range.split(":");

        if (parts.length !== 2) {
            return "#ERROR!";
        }

        const values =
            this.getRangeValues(
                parts[0],
                parts[1],
                grid
            );

        if (typeof values === "string") {
            return values;
        }

        let sum = 0;

        for (const value of values) {

            const number =
                Number(value);

            if (Number.isNaN(number)) {
                return "#VALUE!";
            }

            sum += number;
        }

        return sum;
    }

    hasMatchingOuterParentheses(expression) {

        let depth = 0;

        for (let i = 0; i < expression.length; i++) {

            if (expression[i] === "(") {
                depth++;
            }

            if (expression[i] === ")") {
                depth--;
            }

            if (depth === 0 && i < expression.length - 1) {
                return false;
            }
        }

        return depth === 0;
    }

    findOperator(expression, operator) {

        let depth = 0;

        for (let i = expression.length - 1; i >= 0; i--) {

            const character = expression[i];

            if (character === ")") {
                depth++;
            }

            if (character === "(") {
                depth--;
            }

            if (
                depth === 0 &&
                character === operator
            ) {

                if (
                    operator === "-" &&
                    (
                        i === 0 ||
                        ["+", "-", "*", "/", "("].includes(
                            expression[i - 1]
                        )
                    )
                ) {
                    continue;
                }

                return i;
            }
        }

        return -1;
    }

    getOperandValue(operand, grid) {

        if (/^[A-Z]+[0-9]+$/.test(operand)) {

            const value =
                this.getCellValue(operand, grid);

            if (
                value === "#REF!" ||
                value === "#ERROR!" ||
                value === "#DIV/0!"
            ) {
                return value;
            }

            const number = Number(value);

            if (Number.isNaN(number)) {
                return "#ERROR!";
            }

            return number;
        }

        const number = Number(operand);

        if (!Number.isNaN(number)) {
            return number;
        }

        return "#ERROR!";
    }

    calculate(firstValue, secondValue, operator) {

        if (operator === "+") {
            return firstValue + secondValue;
        }

        if (operator === "-") {
            return firstValue - secondValue;
        }

        if (operator === "*") {
            return firstValue * secondValue;
        }

        if (operator === "/") {

            if (secondValue === 0) {
                return "#DIV/0!";
            }

            return firstValue / secondValue;
        }

        return "#ERROR!";
    }

    getReferences(formula) {

        const expression = formula.substring(1);

        const references =
            expression.match(/[A-Z]+[0-9]+/g);

        if (references === null) {
            return [];
        }

        return references;
    }

    getCellValue(address, grid) {

        const position =
            AddressUtils.parseAddress(address);

        if (position === null) {
            return "#REF!";
        }

        const cellData =
            grid.getCell(
                position.row,
                position.column
            );

        if (cellData === null) {
            return "#REF!";
        }

        return cellData.value;
    }

    getRangeValues(startAddress, endAddress, grid) {

        const cells =
            AddressUtils.getRangeCells(
                startAddress,
                endAddress
            );

        const values = [];

        for (const cell of cells) {

            const cellData =
                grid.getCell(
                    cell.row,
                    cell.column
                );

            if (cellData === null) {
                return "#REF!";
            }

            values.push(cellData.value);
        }

        return values;
    }

}