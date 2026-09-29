# GridForge

GridForge is a web-based spreadsheet application designed to provide a simple and interactive way to create, edit, and manage spreadsheet data. It supports features such as cell editing, formulas, formatting, copy/paste, undo/redo, and persistent data storage.

## Project Proposal

### Project Description

The goal of GridForge is to build a lightweight spreadsheet application that provides the basic functionality users expect from a spreadsheet while keeping the interface simple and easy to use.

The application is being developed from scratch, with separate components for the spreadsheet model, user interface, formula processing, dependency handling, history management, and data storage.

### Goals

- Provide an interactive spreadsheet interface for entering and editing data.
- Support formulas, functions, cell references, and ranges.
- Provide basic spreadsheet formatting options.
- Support copy, paste, undo, and redo operations.
- Store spreadsheet data so it can be restored later.
- Provide spreadsheet-level CRUD operations for managing multiple spreadsheets.
- Make the application usable across desktop, tablet, and mobile screen sizes.

### Specifications

The project includes the following major areas:

- **Spreadsheet Grid** — Rows, columns, cells, and cell selection.
- **Formula Engine** — Formula evaluation, cell references, ranges, and functions.
- **Dependency Management** — Tracks relationships between cells and recalculates dependent cells when required.
- **Formatting** — Bold, italic, font size, and text alignment.
- **History Management** — Undo and redo support for spreadsheet operations.
- **Copy and Paste** — Supports copying cell data and adjusting relative references when pasted.
- **Data Storage** — Spreadsheet data is stored using browser-based storage.
- **Spreadsheet Management** — The application will support creating, opening, updating, and deleting spreadsheets.
- **Responsive Design** — The interface will adapt to different screen sizes.

### Design

GridForge follows a modular structure where different parts of the application have separate responsibilities.

```text
GridForge
│
├── Model
│   ├── Grid
│   └── Cell
│
├── View
│   ├── Spreadsheet View
│   ├── Formula Bar
│   ├── Toolbar
│   └── Status Bar
│
├── Controller
│   └── Spreadsheet Controller
│
├── Services
│   ├── Formula Engine
│   ├── Dependency Graph
│   ├── Recalculation Service
│   ├── History Manager
│   └── Storage Service
│
└── Utilities
    └── Address Utilities
```

This separation keeps the spreadsheet logic independent from the user interface and makes the application easier to maintain and extend.

## Current Features

- Spreadsheet grid with rows and columns
- Cell selection and range selection
- Cell editing
- Formula input through the formula bar
- Formula evaluation
- Cell references and ranges
- Common spreadsheet functions
- Circular dependency detection
- Relative reference adjustment during copy/paste
- Cell formatting
- Undo and redo
- Keyboard navigation
- Automatic scrolling to the selected cell
- Sticky row and column headers
- Local data persistence

## Planned Functionality

The next stage of the project will extend GridForge with:

- A spreadsheet dashboard
- Multiple spreadsheet management
- Create, read, update, and delete operations for spreadsheets
- Responsive improvements for smaller screens
- Further UI and usability improvements

## Data Storage

GridForge uses browser-based local storage to persist spreadsheet data.

The stored data includes:

- Cell values
- Formulas
- Cell formatting
- Spreadsheet structure
- Spreadsheet information

This allows data to remain available even after the page is closed and reopened.

## Technologies Used

- HTML
- CSS
- JavaScript
- Web Storage API

No external JavaScript libraries or frameworks are used.

## How to Run

1. Clone or download the repository.
2. Open the project folder.
3. Open `index.html` using a local development server.
4. Start using GridForge.

## Project Status

GridForge is actively under development. The core spreadsheet functionality has been implemented, and additional spreadsheet management and responsive features are being added as part of the project.

## Future Scope

Possible future improvements include:

- Importing and exporting spreadsheet files
- Additional formulas and functions
- More formatting options
- Improved data visualization
- User accounts and cloud storage
- Collaboration features

## License

GridForge is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.