const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genres: { type: [String], required: true },
  year: { type: Number, required: true },
  image: { type: String },
  IMDBRating: { type: Number },
  NumVotes: { type: Number }
});

movieSchema.index({ title: 1 });
movieSchema.index({ genres: 1 });
movieSchema.index({ year: 1 });
movieSchema.index({ IMDBRating: 1 });

module.exports = mongoose.model('Movie', movieSchema);
