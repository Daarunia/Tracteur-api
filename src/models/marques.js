var mongoose = require("mongoose");
const { DateTime } = require("luxon");

const marqueSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    name: { type: String, required: true },
    releaseDate: {
      type: Date,
      required: true,
      transform: (x) => DateTime.fromJSDate(x).toISODate(),
    },
    tracteurs: [{ type: Number, required: true, ref: "tracteurs"}],
});

marqueSchema.virtual("id").get(function () {
    return this._id;
});

marqueSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
      delete ret._id;
    },
  });

module.exports = mongoose.model("marque", marqueSchema);