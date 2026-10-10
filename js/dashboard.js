import { StorageService } from './services/storageService.js';
import { Spreadsheet } from './models/spreadsheet.js';

const storageService = new StorageService();

const spreadsheetList =
    document.getElementById("spreadsheet-list");

function renderSpreadsheets() {

    const spreadsheets =
        storageService.getSpreadsheets();

    spreadsheetList.innerHTML = "";

    for (const spreadsheet of spreadsheets) {

        const item = document.createElement("article");
        item.classList.add("spreadsheet-card");

        const title = document.createElement("h3");
        title.textContent = spreadsheet.name;

        const updatedAt = document.createElement("p");

        updatedAt.textContent =
            `Last modified: ${new Date(spreadsheet.updatedAt).toLocaleString()}`;

        const actions = document.createElement("div");
        actions.classList.add("spreadsheet-actions");

        const openButton = document.createElement("button");
        openButton.textContent = "Open";

        openButton.addEventListener("click", () => {
            window.location.href =
                `index.html?id=${spreadsheet.id}`;
        });

        const renameButton = document.createElement("button");
        renameButton.textContent = "Rename";

        renameButton.addEventListener("click", () => {

            const newName =
                prompt(
                    "Enter new spreadsheet name:",
                    spreadsheet.name
                );

            if (
                newName === null ||
                newName.trim() === ""
            ) {
                return;
            }

            storageService.renameSpreadsheet(
                spreadsheet.id,
                newName.trim()
            );

            renderSpreadsheets();
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {

            const confirmed =
                confirm(
                    `Delete "${spreadsheet.name}"?`
                );

            if (!confirmed) {
                return;
            }

            storageService.deleteSpreadsheet(
                spreadsheet.id
            );

            renderSpreadsheets();
        });
        
        actions.appendChild(openButton);
        actions.appendChild(renameButton);
        actions.appendChild(deleteButton);
        
        item.appendChild(title);
        item.appendChild(updatedAt);
        item.appendChild(actions);

        spreadsheetList.appendChild(item);
    }
}

renderSpreadsheets();

const newSpreadsheetButton =
    document.getElementById("new-spreadsheet-button");

newSpreadsheetButton.addEventListener("click", () => {

    const name = prompt("Enter spreadsheet name:");

    if (name === null || name.trim() === "") {
        return;
    }

    const spreadsheet = new Spreadsheet(
        crypto.randomUUID(),
        name.trim(),
        50,
        26
    );

    storageService.save(spreadsheet);

    window.location.href =
        `index.html?id=${spreadsheet.id}`;
});