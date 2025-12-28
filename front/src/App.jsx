import { useReducer, useState, useEffect } from "react";
import { todoReducer, initialState } from "./reducers/todoReducer";

function App() {
  const [state, dispatch] = useReducer(todoReducer, initialState);
  const [input, setInput] = useState("");

  // Charger depuis localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      dispatch({
        type: "LOAD_TODOS",
        payload: JSON.parse(saved),
      });
    }
  }, []);

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    if (state.todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(state.todos));
    }
  }, [state.todos]);

  const addTodo = () => {
    if (input.trim()) {
      dispatch({ type: "ADD_TODO", payload: input });
      setInput("");
    }
  };

  // Filtrer les todos
  const filteredTodos = state.todos.filter((todo) => {
    if (state.filter === "active") return !todo.completed;
    if (state.filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0px auto",
        marginLeft: "700px",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", color: "#2c3e50" }}>Ma Todo List</h1>

      {/* Formulaire d’ajout */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Nouvelle tâche..."
          style={{
            flex: 1,
            padding: "12px",
            fontSize: "16px",
            border: "2px solid #ddd",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={addTodo}
          style={{
            padding: "12px 24px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Ajouter
        </button>
      </div>

      {/* Filtres */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        {["all", "active", "completed"].map((filter) => (
          <button
            key={filter}
            onClick={() =>
              dispatch({
                type: "SET_FILTER",
                payload: filter,
              })
            }
            style={{
              padding: "8px 16px",
              backgroundColor: state.filter === filter ? "#3498db" : "#ecf0f1",
              color: state.filter === filter ? "white" : "#2c3e50",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontWeight: state.filter === filter ? "bold" : "normal",
            }}
          >
            {filter === "all"
              ? "Toutes"
              : filter === "active"
              ? "Actives"
              : "Complétées"}
          </button>
        ))}
      </div>

      {/* Liste des tâches */}
      <div>
        {filteredTodos.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              color: "#95a5a6",
              padding: "40px",
            }}
          >
            Aucune tâche à afficher
          </p>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: todo.completed ? "#d5f4e6" : "white",
                border: "1px solid #ddd",
                borderRadius: "5px",
              }}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  dispatch({
                    type: "TOGGLE_TODO",
                    payload: todo.id,
                  })
                }
                style={{
                  marginRight: "15px",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  flex: 1,
                  fontSize: "16px",
                  textDecoration: todo.completed ? "line-through" : "none",
                  color: todo.completed ? "#95a5a6" : "#2c3e50",
                }}
              >
                {todo.text}
              </span>
              <button
                onClick={() =>
                  dispatch({
                    type: "DELETE_TODO",
                    payload: todo.id,
                  })
                }
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#e74c3c",
                  color: "white",
                  border: "none",
                  borderRadius: "3px",
                  cursor: "pointer",
                }}
              >
                Supprimer
              </button>
            </div>
          ))
        )}
      </div>

      {/* Statistiques */}
      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          padding: "15px",
          backgroundColor: "#ecf0f1",
          borderRadius: "5px",
        }}
      >
        <strong>Total :</strong> {state.todos.length} |
        <strong> Complétées :</strong>{" "}
        {state.todos.filter((t) => t.completed).length}
      </div>
    </div>
  );
}

export default App;
