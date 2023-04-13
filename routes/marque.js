var express = require('express');
var router = express.Router();
var marque_controller = require("../src/controllers/marque");

router.post("/", marque_controller.create);
router.get("/", marque_controller.getAll);
router.get("/:id", marque_controller.getById);
router.put("/:id", marque_controller.update);
router.delete("/:id", marque_controller.delete);

module.exports = router;