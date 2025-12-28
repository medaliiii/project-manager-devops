const Project = require("../models/Project");

// GET /api/projects?status=&q=&sortBy=&order=
exports.getProjects = async (req, res) => {
  try {
    const { status, q, sortBy = "deadline", order = "asc" } = req.query;

    const filter = {};
    if (status && ["todo", "in_progress", "done"].includes(status)) {
      filter.status = status;
    }

    // Search (q): title/description text search
    if (q && q.trim()) {
      filter.$text = { $search: q.trim() };
    }

    const sortFieldsAllowed = ["deadline", "createdAt", "title", "status"];
    const sortField = sortFieldsAllowed.includes(sortBy) ? sortBy : "deadline";
    const sortOrder = order === "desc" ? -1 : 1;

    const query = Project.find(filter).sort({ [sortField]: sortOrder });

    // If text search used, you can also project textScore if needed
    const projects = await query.exec();

    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Projet introuvable" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: "ID invalide", error: err.message });
  }
};

// POST /api/projects
exports.createProject = async (req, res) => {
  try {
    const { title, description = "", status = "todo", deadline } = req.body;

    if (!title || !deadline) {
      return res
        .status(400)
        .json({ message: "title et deadline sont obligatoires" });
    }

    if (!["todo", "in_progress", "done"].includes(status)) {
      return res.status(400).json({ message: "status invalide" });
    }

    const project = await Project.create({
      title,
      description,
      status,
      deadline,
    });

    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// PUT /api/projects/:id
exports.updateProject = async (req, res) => {
  try {
    const updates = {};
    const allowed = ["title", "description", "status", "deadline"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (
      updates.status &&
      !["todo", "in_progress", "done"].includes(updates.status)
    ) {
      return res.status(400).json({ message: "status invalide" });
    }

    const project = await Project.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!project)
      return res.status(404).json({ message: "Projet introuvable" });
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: "Erreur", error: err.message });
  }
};

// DELETE /api/projects/:id
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project)
      return res.status(404).json({ message: "Projet introuvable" });
    res.json({ message: "Projet supprimé" });
  } catch (err) {
    res.status(400).json({ message: "ID invalide", error: err.message });
  }
};
