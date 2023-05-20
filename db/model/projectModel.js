const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  Total: {
    type: Number,
    default: 0,
  },
});

projectSchema.index({ name: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('grades', projectSchema);
