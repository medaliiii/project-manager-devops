export const initialProjects = [];

export function projectReducer(state, action) {
  switch (action.type) {
    case "LOAD_PROJECTS":
      // payload = tableau de projets depuis backend
      return Array.isArray(action.payload) ? action.payload : [];

    case "ADD_PROJECT":
      // payload = projet créé retourné par backend
      return [action.payload, ...state];

    case "UPDATE_STATUS":
      // payload = projet mis à jour (retourné par backend)
      return state.map((project) =>
        project._id === action.payload._id ? action.payload : project
      );

    case "DELETE_PROJECT":
      // payload = id (_id Mongo)
      return state.filter((project) => project._id !== action.payload);

    default:
      return state;
  }
}
