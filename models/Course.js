// const mongoose = require('mongoose');

// const moduleSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     type: { type: String, enum: ['video', 'text', 'quiz'], required: true },
//     content: { type: String }, 
//     videoUrl: { type: String }, 
//     quizQuestions: [
//         {
//             question: String,
//             options: [String],
//             correctAnswer: String
//         }
//     ],
//     order: { type: Number, required: true }
// });

// const courseSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     instructor: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     category: {
//         type: String,
//         required: true
//     },
//     durationDays: {
//         type: Number,
//         default: 5
//     },
//     modules: [moduleSchema],
//     enrollments: [{
//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'User'
//         },
//         progress: {
//             type: Number, 
//             default: 0
//         },
//         completedModules: [String], 
//         enrolledAt: { type: Date, default: Date.now }
//     }],
//     reviews: [
//         {
//             user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
//             rating: { type: Number, min: 1, max: 5 },
//             comment: String,
//             reviewedAt: { type: Date, default: Date.now }
//         }
//     ],
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Course', courseSchema);


const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverImage: {
    type: String,
    default: ''
  },
  days: [{
    dayNumber: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    title: {
      type: String,
      required: true
    },
    content: {
      videoUrl: String,
      text: String,
      quiz: {
        question: String,
        options: [String],
        correctAnswer: Number
      }
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  enrollmentCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Ensure days array has max 5 elements
courseSchema.pre('save', function(next) {
  if (this.days.length > 5) {
    return next(new Error('Course cannot have more than 5 days'));
  }
  next();
});

module.exports = mongoose.model('Course', courseSchema);