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

        const argumentsExpression =
            expression.substring(
                4,
                expression.length - 1
            );

        const argumentsList =
            this.splitArguments(argumentsExpression);

        let sum = 0;

        for (const argument of argumentsList) {

            const parts = argument.split(":");

            if (
                parts.length === 2 &&
                AddressUtils.parseAddress(parts[0]) !== null &&
                AddressUtils.parseAddress(parts[1]) !== null
            ) {
                const values =
                    this.getRangeValues(
                        parts[0],
                        parts[1],
                        grid
                    );

                if (typeof values === "string") {
                    return values;
                }

                for (const value of values) {
                    const number = Number(value);

                    if (Number.isNaN(number)) {
                        return "#VALUE!";
                    }

                    sum += number;
                }
            } else {
                const value =
                    this.evaluateExpression(
                        argument,
                        grid
                    );

                if (typeof value === "string") {
                    return value;
                }

                sum += value;
            }

        }

        return sum;
    }

    splitArguments(expression) {

        const argumentsList = [];
        let currentArgument = "";
        let depth = 0;

        for (const character of expression) {

            if (character === "(") {
                depth++;
            }

            if (character === ")") {
                depth--;
            }

            if (character === "," && depth === 0) {

                argumentsList.push(
                    currentArgument.trim()
                );

                currentArgument = "";

                continue;
            }

            currentArgument += character;
        }

        if (currentArgument.trim() !== "") {

            argumentsList.push(
                currentArgument.trim()
            );
        }

        return argumentsList;
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

        const references = new Set();

        const rangePattern =
            /([A-Z]+[0-9]+):([A-Z]+[0-9]+)/g;

        let rangeMatch;

        while ((rangeMatch = rangePattern.exec(expression)) !== null) {

            const startAddress = rangeMatch[1];
            const endAddress = rangeMatch[2];

            const cells =
                AddressUtils.getRangeCells(
                    startAddress,
                    endAddress
                );

            for (const cell of cells) {
                references.add(
                    AddressUtils.columnToName(cell.column) +
                    (cell.row + 1)
                );
            }
        }

        const expressionWithoutRanges =
            expression.replace(rangePattern, "");

        const singleReferences =
            expressionWithoutRanges.match(
                /[A-Z]+[0-9]+/g
            );

        if (singleReferences !== null) {
            for (const reference of singleReferences) {
                references.add(reference);
            }
        }

        return [...references];
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