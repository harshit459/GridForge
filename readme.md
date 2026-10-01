# GridForge

GridForge is a web-based spreadsheet application designed to provide a simple and interactive way to create, edit, and manage spreadsheet data. It supports cell editing, formulas, formatting, copy/paste, undo/redo, spreadsheet management, and persistent data storage.

## Project Proposal

### Project Description

The goal of GridForge is to build a lightweight spreadsheet application that provides the basic functionality expected from a spreadsheet while keeping the interface simple and easy to use.

The application is developed from scratch using HTML, CSS, and JavaScript with separate components for spreadsheet models, UI, formula processing, dependency management, history, and storage.

GridForge consists of two main interfaces:

- **Dashboard** — Manage multiple spreadsheets.
- **Spreadsheet Editor** — Edit cells, enter formulas, apply formatting, and work with spreadsheet data.

### Goals

- Provide an interactive spreadsheet interface.
- Support formulas, functions, cell references, and ranges.
- Provide basic cell formatting.
- Support copy, paste, undo, and redo.
- Persist spreadsheet data using browser storage.
- Provide CRUD operations for multiple spreadsheets.
- Support desktop, tablet, and mobile screens.

### Specifications

- **Spreadsheet Grid** — Rows, columns, cells, selection, and ranges.
- **Formula Engine** — Formula evaluation, references, ranges, and functions.
- **Dependency Management** — Tracks formula dependencies and recalculates affected cells.
- **Formatting** — Bold, italic, font size, and text alignment.
- **History Management** — Undo and redo.
- **Copy and Paste** — Supports relative reference adjustment.
- **Data Storage** — Uses browser LocalStorage.
- **Spreadsheet Management** — Create, open, rename, and delete spreadsheets.
- **Responsive Design** — Adapts to different screen sizes.

### Design

GridForge follows a modular structure:

    GridForge
    │
    ├── Models
    │   ├── Spreadsheet
    │   ├── Grid
    │   └── Cell
    │
    ├── Views
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

This separation keeps spreadsheet logic independent from the UI and makes the project easier to maintain and extend.

## Current Features

### Spreadsheet

- Spreadsheet grid with rows and columns
- Cell and range selection
- Cell editing
- Formula bar
- Formula evaluation
- Cell and range references
- Common spreadsheet functions
- Circular dependency detection
- Automatic recalculation
- Copy and paste with relative reference adjustment
- Undo and redo
- Keyboard navigation
- Sticky row and column headers

### Formatting

- Bold
- Italic
- Font size
- Text alignment

### Spreadsheet Management

- Dashboard
- Create spreadsheets
- Open spreadsheets
- Rename spreadsheets
- Delete spreadsheets
- Multiple spreadsheet support
- Last modified time

### Persistence

- LocalStorage-based persistence
- Saves cell values
- Saves formulas
- Saves formatting
- Saves spreadsheet structure
- Restores saved spreadsheets
- Rebuilds formula dependencies after loading

## CRUD Operations

GridForge supports spreadsheet-level CRUD operations.

- **Create** — Create a new spreadsheet from the dashboard.
- **Read** — View and open saved spreadsheets.
- **Update** — Rename spreadsheets and modify spreadsheet data.
- **Delete** — Remove spreadsheets from LocalStorage.

## Data Storage

GridForge uses the browser's **Web Storage API**, specifically `localStorage`.

Stored data includes:

- Spreadsheet ID and name
- Creation and modification timestamps
- Grid dimensions
- Cell values
- Cell formulas
- Cell formatting

Multiple spreadsheets can be stored independently.

## Responsive Design

GridForge supports:

- Desktop
- Tablet
- Mobile

The dashboard uses a responsive card layout, while the spreadsheet editor provides scrolling for larger grids and sticky headers for easier navigation.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- LocalStorage
- GitHub

No external JavaScript libraries or frameworks are used.

## How to Run

1. Clone or download the repository.

2. Open the project directory.

3. Start a local development server. For example, use the **Live Server** extension in VS Code.

4. Open `dashboard.html`.

The dashboard is the main entry point of GridForge.

> A local development server is recommended because GridForge uses JavaScript ES modules.

## Project Status

The core spreadsheet functionality and spreadsheet management features have been implemented.

Current implementation includes:

- Spreadsheet dashboard
- Spreadsheet CRUD
- Formula evaluation
- Dependency management
- Formula recalculation
- Circular dependency detection
- Cell formatting
- Copy and paste
- Undo and redo
- LocalStorage persistence
- Responsive UI
- Sticky headers

The project is currently in the **testing and refinement stage**.

## Future Scope

Possible future improvements include:

- Import and export of spreadsheet files
- Additional formulas and functions
- More formatting options
- Row and column resizing
- Search and replace
- Charts and data visualization
- User accounts
- Cloud storage
- Real-time collaboration
- Backend-based persistence

## Project Requirements Covered

- HTML
- CSS
- JavaScript
- JavaScript Classes
- Responsive Design
- Multiple Pages
- Web Storage
- CRUD Operations
- Git and GitHub
- Markdown Documentation
- Project Proposal

## Version Control

Git is used throughout the development of GridForge.

Development has been divided into incremental commits covering the spreadsheet core, formula engine, dependency management, recalculation, history, persistence, UI improvements, dashboard, CRUD operations, and persistence fixes.

## License

GridForge is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.