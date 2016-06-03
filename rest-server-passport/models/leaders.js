var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create promotions schema
var leadersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    },
    designation: {
      type: String,
      required: true
    },
    abbr: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

var Leaders = mongoose.model('Leader', leadersSchema);

module.exports = Leaders;
