export class DependencyGraph {

    constructor() {
        this.dependencies = new Map();
        this.dependents = new Map();
    }

    setDependencies(cellAddress, references) {

        const oldReferences =
            this.dependencies.get(cellAddress) || [];

        for (const reference of oldReferences) {

            const dependents =
                this.dependents.get(reference);

            if (dependents === undefined) {
                continue;
            }

            const updatedDependents =
                dependents.filter(
                    dependent => dependent !== cellAddress
                );

            if (updatedDependents.length === 0) {
                this.dependents.delete(reference);
            } else {
                this.dependents.set(
                    reference,
                    updatedDependents
                );
            }
        }

        this.dependencies.set(
            cellAddress,
            references
        );

        for (const reference of references) {

            if (!this.dependents.has(reference)) {
                this.dependents.set(reference, []);
            }

            this.dependents
                .get(reference)
                .push(cellAddress);
        }
    }

    getDependents(cellAddress) {

        return this.dependents.get(cellAddress) || [];
    }

    getAllDependents(cellAddress) {

        const result = [];
        const visited = new Set();
        const queue = [cellAddress];

        visited.add(cellAddress);

        while (queue.length > 0) {

            const currentCell = queue.shift();

            const dependents =
                this.getDependents(currentCell);

            for (const dependent of dependents) {

                if (visited.has(dependent)) {
                    continue;
                }

                visited.add(dependent);

                result.push(dependent);

                queue.push(dependent);
            }
        }

        return result;
    }

    hasCircularDependency(cellAddress) {

        const visited = new Set();
        const path = [];

        const visit = (address) => {

            const pathIndex =
                path.indexOf(address);

            if (pathIndex !== -1) {
                return path.slice(pathIndex);
            }

            if (visited.has(address)) {
                return null;
            }

            visited.add(address);
            path.push(address);

            const dependencies =
                this.dependencies.get(address) || [];

            for (const dependency of dependencies) {

                const cycle =
                    visit(dependency);

                if (cycle !== null) {
                    return cycle;
                }
            }

            path.pop();

            return null;
        };

        return visit(cellAddress);
    }

}