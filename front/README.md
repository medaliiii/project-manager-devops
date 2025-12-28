# Project Manager

Brief overview of a small MERN-style frontend project built with Vite and React. This repository contains several example small apps (Todo, ShoppingList, Blog) and a main projects dashboard component `ProjetFinal` that centralises project management features.

**How to run**

- Install dependencies:

```powershell
npm install
```

- Start dev server (Vite):

```powershell
npm run dev
```

Open http://localhost:5173 (or the port Vite reports).

**Repository structure (important files)**

- `index.html` : app entry HTML
- `vite.config.js` : Vite configuration
- `package.json` : scripts & dependencies
- `src/` : application source
  - `main.jsx` : React app bootstrap
  - `App.jsx` : main Todo app using `todoReducer` (example)
  - `ProjetFinal.jsx` : Project manager dashboard (focus of this README)
  - `BlogApp.jsx` : Blog example component
  - `ShoppingListApp.jsx` : Shopping list + Pomodoro example
  - `assets/` : images & static assets
  - `reducers/` : reducers used by components
    - `todoReducer.js` : todos state & actions
    - `projectReducer.js` : projects state & actions

**Focus — `ProjetFinal`**

`ProjetFinal.jsx` is the projects dashboard component and the main feature of this repo. Key points:

- Features:
  - Create / Read / Update / Delete (CRUD) projects
  - Filter and search projects
  - Sort projects by deadline, status or creation date
  - Local persistence (localStorage)
  - Basic statistics (counts by status, upcoming deadlines)
  - (Optional) Pomodoro / timer integration for project tasks

- Data shape (projects):

  Each project object follows the pattern used by `projectReducer`:

  - `id` (number): unique id (e.g. `Date.now()`)
  - `title` (string)
  - `description` (string)
  - `status` (string): e.g. `todo`, `in-progress`, `done`
  - `deadline` (string): ISO date string or empty
  - `createdAt` (string): ISO timestamp

- Reducer & actions:

  `src/reducers/projectReducer.js` implements the state transitions. Actions used:

  - `LOAD_PROJECTS` — payload: array of projects (used to load from `localStorage`)
  - `ADD_PROJECT` — payload: `{ title, description, status, deadline }`
  - `UPDATE_STATUS` — payload: `{ id, status }`
  - `DELETE_PROJECT` — payload: `id`














