var express = require('express');
var router = express.Router();
var tracteur_controller = require("../src/controllers/tracteur");

router.post("/", tracteur_controller.create);
router.get("/", tracteur_controller.getAll);
router.get("/:id", tracteur_controller.getById);
router.put("/:id", tracteur_controller.update);
router.delete("/:id", tracteur_controller.delete);

module.exports = router;
