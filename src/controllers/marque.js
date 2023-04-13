var Marque = require("../models/marques");
const { param, body, validationResult } = require("express-validator");

const marqueValidationRules = () => {
    return [   
        body("name")
            .trim()
            .isLength({ min: 1 })
            .escape()
            .withMessage("Name must be specified."),

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

exports.create = [bodyIdValidationRule(), marqueValidationRules(), checkValidity, (req, res, next) => {
    var marque = new Marque({
        _id: req.body.id,
        name: req.body.name,
        releaseDate: req.body.releaseDate,
        tracteurs: req.body.tracteurs,
    });

    marque.save(function (err) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(201).json("Marque created successfully !");
    });
}];

exports.getAll = (req, res, next) => {
    Marque.find()
        .populate("tracteurs")
        .exec(function (err, result) {
        if (err) {
            return res.status(500).json(err);
        }
            return res.status(200).json(result);
        });
};

exports.getById = [paramIdValidationRule(), checkValidity, (req, res, next) => {
    Marque.findById(req.params.id)
    .populate("tracteurs")
    .exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        return res.status(200).json(result);
    });
}];

exports.update = [
    paramIdValidationRule(),
    marqueValidationRules(),
    checkValidity,
    (req, res, next) => {
    var marque = new Marque({
        _id: req.body.id,
        name: req.body.name,
        releaseDate: req.body.releaseDate,
        tracteurs: req.body.tracteurs,
    });

      Marque.findByIdAndUpdate(req.params.id, marque, function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Marque with id "+req.params.id+" is not found !");
        }
        return res.status(201).json("Marque updated successfully !");
      });
}];

exports.delete = [paramIdValidationRule(), checkValidity,(req, res, next) => {
    Marque.findByIdAndRemove(req.params.id).exec(function (err, result) {
        if (err) {
          return res.status(500).json(err);
        }
        if(!result){
            res.status(404).json("Marque with id "+req.params.id+" is not found !");
        }
        return res.status(200).json("Marque deleted successfully !");
      });
}];