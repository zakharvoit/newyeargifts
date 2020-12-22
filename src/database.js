import mongoose, { Schema } from 'mongoose';

const assignmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  assignee: {
    type: String,
    required: true,
  },
});

const wishSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    wish: {
        type: String,
        required: true,
    },
});

export const Assignment = mongoose.model('assignment', assignmentSchema);
export const Wish = mongoose.model('wish', wishSchema);
