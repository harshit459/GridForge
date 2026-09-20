export class HistoryManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
    }

    record(action) {
        this.undoStack.push(action);

        this.redoStack = [];
    }

    undo() {
        if (this.undoStack.length === 0) {
            return;
        }

        const action =
            this.undoStack.pop();

        action.undo();

        this.redoStack.push(action);
    }

    redo() {
        if (this.redoStack.length === 0) {
            return;
        }

        const action =
            this.redoStack.pop();

        action.redo();

        this.undoStack.push(action);
    }

}