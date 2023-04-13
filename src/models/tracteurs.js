var mongoose = require("mongoose");
const { DateTime } = require("luxon");

const tracteurSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    model: { type: String, required: true },
    power: { type: String, required: true },
    liftingCapacity: { type: String, required: true },
    weight: { type: Number, required: true },
    releaseDate: {
      type: Date,
      required: true,
      transform: (x) => DateTime.fromJSDate(x).toISODate(),
    },
    marque: { type: Number, required: true, ref: "marque"},
});

tracteurSchema.virtual("id").get(function () {
    return this._id;
});

tracteurSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

module.exports = mongoose.model("tracteurs", tracteurSchema);