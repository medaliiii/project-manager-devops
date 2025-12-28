
import { useReducer, useState, useEffect } from "react";
import { projectReducer, initialProjects } from "./reducers/projectReducer";

function ProjetFinal() {
  // 1) useReducer : gestion des projets (CRUD)
  const [projects, dispatch] = useReducer(projectReducer, initialProjects);

  // 2) useState : formulaires, filtres, recherche
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [deadline, setDeadline] = useState("");

  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [searchTerm, setSearchTerm] = useState("");

  // 3) Timer Pomodoro par projet (un actif à la fois)
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // ------------------- useEffect : localStorage -------------------

  // Charger depuis localStorage au montage
  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      dispatch({
        type: "LOAD_PROJECTS",
        payload: JSON.parse(saved),
      });
    }
  }, []);

  // Sauvegarder dans localStorage à chaque modification
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  // ------------------- useEffect : Timer Pomodoro -------------------

  useEffect(() => {
    let interval = null;

    if (isActive && activeProjectId) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            return 59;
          }
          return prevSeconds - 1;
        });
        setMinutes((prevMinutes) => {
          if (seconds === 0) {
            // ici seconds est l'ancienne valeur, mais ça reste ok
            if (prevMinutes === 0) {
              clearInterval(interval);
              setIsActive(false);
              alert("Pomodoro terminé !");
              return 0;
            }
            return prevMinutes - 1;
          }
          return prevMinutes;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, activeProjectId, seconds]);

  // ------------------- Handlers -------------------

  function handleAddProject(e) {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !deadline) return;

    dispatch({
      type: "ADD_PROJECT",
      payload: { title, description, status, deadline },
    });

    setTitle("");
    setDescription("");
    setStatus("todo");
    setDeadline("");
  }

  function handleDeleteProject(id) {
    dispatch({ type: "DELETE_PROJECT", payload: id });
    if (activeProjectId === id) {
      setIsActive(false);
      setActiveProjectId(null);
      setMinutes(25);
      setSeconds(0);
    }
  }

  function handleStatusChange(id, newStatus) {
    dispatch({
      type: "UPDATE_STATUS",
      payload: { id, status: newStatus },
    });
  }

  function startTimerForProject(id) {
    setActiveProjectId(id);
    setMinutes(25);
    setSeconds(0);
    setIsActive(true);
  }

  function pauseTimer() {
    setIsActive(false);
  }

  function resetTimerForProject(id) {
    if (activeProjectId === id) {
      setIsActive(false);
      setMinutes(25);
      setSeconds(0);
    }
  }

  

  let visibleProjects = [...projects];

  // Filtre statut
  if (filterStatus !== "all") {
    visibleProjects = visibleProjects.filter((p) => p.status === filterStatus);
  }

  // Recherche
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    visibleProjects = visibleProjects.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }

  // Tri
  visibleProjects.sort((a, b) => {
    if (sortBy === "deadline") {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Statistiques
  const total = projects.length;
  const todoCount = projects.filter((p) => p.status === "todo").length;
  const doingCount = projects.filter((p) => p.status === "doing").length;
  const doneCount = projects.filter((p) => p.status === "done").length;

  // ------------------- Render -------------------

  return (
    <div
          style={{
          marginLeft:"500px" ,
        maxWidth: "900px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Gestionnaire de Projets</h1>

      {/* FORMULAIRE */}
      <form
        onSubmit={handleAddProject}
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "8px",
          backgroundColor: "#f4f6f7",
        }}
      >
        <h2>Ajouter un projet</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ padding: "8px" }}
          >
            <option value="todo">À faire</option>
            <option value="doing">En cours</option>
            <option value="done">Terminé</option>
          </select>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{ padding: "8px" }}
          />
        </div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
        />
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#27ae60",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Ajouter le projet
        </button>
      </form>

      {/* FILTRES / RECHERCHE / TRI */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          borderRadius: "8px",
          backgroundColor: "#ecf0f1",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <div>
          <strong>Filtrer par statut : </strong>
          {["all", "todo", "doing", "done"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                marginLeft: "5px",
                padding: "6px 10px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                backgroundColor: filterStatus === s ? "#3498db" : "#bdc3c7",
                color: "white",
              }}
            >
              {s === "all"
                ? "Tous"
                : s === "todo"
                ? "À faire"
                : s === "doing"
                ? "En cours"
                : "Terminé"}
            </button>
          ))}
        </div>

        <div>
          <strong>Recherche : </strong>
          <input
            type="text"
            placeholder="Titre ou description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: "6px", minWidth: "200px" }}
          />
        </div>

        <div>
          <strong>Trier par : </strong>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: "6px" }}
          >
            <option value="deadline">Deadline</option>
            <option value="title">Titre</option>
          </select>
        </div>
      </div>

      {/* STATISTIQUES */}
      <div
        style={{
          marginTop: "20px",
          padding: "15px",
          backgroundColor: "#dfe6e9",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <div>
          <strong>Total :</strong> {total}
        </div>
        <div>
          <strong>À faire :</strong> {todoCount}
        </div>
        <div>
          <strong>En cours :</strong> {doingCount}
        </div>
        <div>
          <strong>Terminés :</strong> {doneCount}
        </div>
      </div>

      {/* LISTE DES PROJETS */}
      <div style={{ marginTop: "20px" }}>
        {visibleProjects.length === 0 ? (
          <p style={{ textAlign: "center", color: "#7f8c8d" }}>
            Aucun projet à afficher.
          </p>
        ) : (
          visibleProjects.map((project) => {
            const isCurrent = activeProjectId === project.id;
            return (
              <div
                key={project.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "10px",
                  backgroundColor:
                    project.status === "done"
                      ? "#d5f5e3"
                      : project.status === "doing"
                      ? "#fcf3cf"
                      : "white",
                }}
              >
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <p>
                  <strong>Statut :</strong> {project.status} |{" "}
                  <strong>Deadline :</strong> {project.deadline}
                </p>

                {/* Changement de statut */}
                <div style={{ marginBottom: "10px" }}>
                  <strong>Changer le statut : </strong>
                  {["todo", "doing", "done"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(project.id, s)}
                      style={{
                        marginLeft: "5px",
                        padding: "5px 8px",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer",
                        backgroundColor:
                          project.status === s ? "#2980b9" : "#bdc3c7",
                        color: "white",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {/* Timer Pomodoro pour ce projet */}
                <div
                  style={{
                    padding: "10px",
                    borderRadius: "6px",
                    backgroundColor: "#f0f3f4",
                    marginBottom: "10px",
                  }}
                >
                  <strong>Pomodoro :</strong>{" "}
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "20px",
                      marginLeft: "10px",
                    }}
                  >
                    {isCurrent
                      ? `${String(minutes).padStart(2, "0")}:${String(
                          seconds
                        ).padStart(2, "0")}`
                      : "25:00"}
                  </span>
                  <div style={{ marginTop: "8px" }}>
                    {!isCurrent && (
                      <button
                        onClick={() => startTimerForProject(project.id)}
                        style={{
                          padding: "6px 10px",
                          marginRight: "5px",
                          borderRadius: "4px",
                          border: "none",
                          backgroundColor: "#27ae60",
                          color: "white",
                        }}
                      >
                        Démarrer
                      </button>
                    )}
                    {isCurrent && (
                      <>
                        <button
                          onClick={pauseTimer}
                          style={{
                            padding: "6px 10px",
                            marginRight: "5px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: "#f39c12",
                            color: "white",
                          }}
                        >
                          {isActive ? "Pause" : "Reprendre"}
                        </button>
                        <button
                          onClick={() => resetTimerForProject(project.id)}
                          style={{
                            padding: "6px 10px",
                            marginRight: "5px",
                            borderRadius: "4px",
                            border: "none",
                            backgroundColor: "#7f8c8d",
                            color: "white",
                          }}
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteProject(project.id)}
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#e74c3c",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Supprimer
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ProjetFinal;
