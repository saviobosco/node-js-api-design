import mongoose from 'mongoose'

const studentSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  date_of_birth: {
    type: mongoose.Schema.Types.Date,
  },
  gender: {
    type: String,
  },
  state_of_origin:{
    type: String
  },
  home_residence: String,
  guardian: {
    name: String,
    occupation: String,
    relationship: String,
    phone_number: String,
  },
  class_id: Number,
  status: {
    type: Number,
    default: 1,
  }
}, {timestamps: true})

studentSchema.methods = {
}

export const Student = mongoose.model('students', studentSchema)
