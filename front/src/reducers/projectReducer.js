
export const initialProjects = [];

export function projectReducer(state, action) {
  switch (action.type) {
    case "LOAD_PROJECTS":
      // payload = tableau de projets depuis localStorage
      return action.payload || [];

    case "ADD_PROJECT":
      // payload = { title, description, status, deadline }
      return [
        {
          id: Date.now(),
          title: action.payload.title,
          description: action.payload.description,
          status: action.payload.status,
          deadline: action.payload.deadline,
          createdAt: new Date().toISOString(),
        },
        ...state,
      ];

    case "UPDATE_STATUS":
      // payload = { id, status }
      return state.map((project) =>
        project.id === action.payload.id
          ? { ...project, status: action.payload.status }
          : project
      );

    case "DELETE_PROJECT":
      // payload = id
      return state.filter((project) => project.id !== action.payload);

    default:
      return state;
  }
}
