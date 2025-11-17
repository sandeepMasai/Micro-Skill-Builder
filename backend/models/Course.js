
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverImage: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  days: [{
    dayNumber: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    content: {
      videoUrl: String,
      text: String,
      pdfFiles: [{
        name: String,
        url: String,
        size: Number
      }],
      notes: String,
      tasks: [{
        title: String,
        description: String,
        completed: { type: Boolean, default: false }
      }],
      quiz: {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
      }
    }
  }],
  isPublished: { type: Boolean, default: true },
  enrollmentCount: { type: Number, default: 0 }
}, { timestamps: true });

courseSchema.pre('save', function(next) {
  if (this.days.length > 5) {
    return next(new Error('Course cannot have more than 5 days'));
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);