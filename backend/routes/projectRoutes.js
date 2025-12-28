const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/projectController");

router.get("/", ctrl.getProjects);
router.post("/", ctrl.createProject);
router.get("/:id", ctrl.getProjectById);
router.put("/:id", ctrl.updateProject);
router.delete("/:id", ctrl.deleteProject);

module.exports = router;
