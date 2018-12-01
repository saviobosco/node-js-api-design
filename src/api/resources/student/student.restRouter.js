import express from 'express'
import studentController from './student.controller'

export const studentRouter = express.Router()

studentRouter.param('id', studentController.findByParam)

studentRouter.route('/')
  .get(studentController.getAll)
  .post(studentController.createOne)

studentRouter.route('/:id')
  .get(studentController.getOne)
  .put(studentController.updateOne)
  .delete(studentController.deleteOne)
