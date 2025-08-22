const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  isAIGenerated:{
   type:Boolean,
   default:false
  },
  aiMetadata:{
    originalTopic:String,
    noteType:String,
    generatedAt:Date
  }
});

module.exports = mongoose.model('Note', NoteSchema);
