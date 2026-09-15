import { FormulaEngine } from "./formulaEngine.js";
import { AddressUtils } from "../utils/addressUtils.js";

export class RecalculationService {

    constructor(grid, dependencyGraph) {
        this.grid = grid;
        this.dependencyGraph = dependencyGraph;
        this.formulaEngine = new FormulaEngine();
    }

    recalculateCell(address) {

        const cell = this.getCell(address);

        if (cell === null) {
            return;
        }

        if (cell.formula === "") {
            return;
        }

        cell.value =
            this.formulaEngine.evaluate(
                cell.formula,
                this.grid
            );
    }

    recalculateDependents(address) {

        const dependents =
            this.dependencyGraph.getAllDependents(address);

        for (const dependent of dependents) {
            this.recalculateCell(dependent);
        }

        return dependents;
    }

    getCell(address) {

        const position =
            AddressUtils.parseAddress(address);

        if (position === null) {
            return null;
        }

        return this.grid.getCell(
            position.row,
            position.column
        );
    }

    setCellContent(address, content) {

        const cell = this.getCell(address);

        if (cell === null) {
            return;
        }

        if (content.startsWith("=")) {

            cell.formula = content;

            const references =
                this.formulaEngine.getReferences(content);

            this.dependencyGraph.setDependencies(
                address,
                references
            );

            const cycle =
                this.dependencyGraph.hasCircularDependency(address);

            if (cycle !== null) {

                const affectedAddresses = new Set(cycle);

                for (const cycleAddress of cycle) {

                    const dependents =
                        this.dependencyGraph.getAllDependents(
                            cycleAddress
                        );

                    for (const dependent of dependents) {
                        affectedAddresses.add(dependent);
                    }
                }

                for (const affectedAddress of affectedAddresses) {

                    const affectedCell =
                        this.getCell(affectedAddress);

                    if (affectedCell !== null) {
                        affectedCell.value = "#CIRCULAR!";
                    }
                }

                return [...affectedAddresses];
            }

            cell.value =
                this.formulaEngine.evaluate(
                    content,
                    this.grid
                );

        } else {

            cell.formula = "";
            cell.value = content;

            this.dependencyGraph.setDependencies(
                address,
                []
            );
        }

        return this.recalculateDependents(address);
    }

}