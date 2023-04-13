// Import du modèle tracteur
var Tracteur = require("../models/tracteurs");

// Import de express-validator
const { param, body, validationResult } = require("express-validator");

// Déterminer les règles de validation de la requête
const tracteurValidationRules = () => {
    return [   
        body("model")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Model must be specified."),

        body("power")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Power must be specified."),

        body("liftingCapacity")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("lifting capacity must be specified."),

        body("weight")
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Weight must be a positive number."),

        body("releaseDate", "Invalid date of release")
            .optional({ checkFalsy: true })
            .isISO8601()
            .toDate()
    ]
}

const paramIdValidationRule = () => {
    return [
        param("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

const bodyIdValidationRule = () => {
    return [
        body("id")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Id must be specified.")
            .isNumeric()
            .withMessage("Id must be a number.")
    ]
};

// Méthode de vérification de la conformité de la requête  
const checkValidity = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

    return res.status(400).json({
        errors: extractedErrors,
    })
}

// Create
exports.create = [bodyIdValidationRule(), tracteurValidationRules(), checkValidity, (req, res, next) => {
    
    // Création de la nouvelle instance de tracteur à ajouter 
    var tracteur = new Tracteur({
        _id: req.body.id,
        model: req.body.model,
        power: req.body.power,
        liftingCapacity: req.body.liftingCapacity,
        weight: req.body.weight,
        releaseDate: req.body.releaseDate,
      });

    // Ajout de tracteur dans la bdd 
    tracteur.save(function (err) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(201).json("Tracteur created successfully !");
    });
}];

// Read
exports.getAll = (req, res, next) => {
    Tracteur.find(function (err, result) {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json(result);
    });
};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Tracteur.findById(req.params.id).exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
    });
}];

// Update
exports.update = [paramIdValidationRule(), tracteurValidationRules(), checkValidity,(req, res, next) => {
    
    // Création de la nouvelle instance de tracteur à modifier 
    var tracteur = new Tracteur({
        _id: req.body.id,
        model: req.body.model,
        power: req.body.power,
        liftingCapacity: req.body.liftingCapacity,
        weight: req.body.weight,
        releaseDate: req.body.releaseDate,
      });

      Tracteur.findByIdAndUpdate(req.params.id, tracteur, function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Tracteur with id "+req.params.id+" is not found !");
        }
        return res.status(201).json("Tracteur updated successfully !");
      });
}];

// Delete
exports.delete = [paramIdValidationRule(), checkValidity,(req, res, next) => {
    Tracteur.findByIdAndRemove(req.params.id).exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Tracteur with id "+req.params.id+" is not found !");
        }
        return res.status(200).json("Tracteur deleted successfully !");
      });
}];