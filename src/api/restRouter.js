import express from 'express'
import { userRouter } from './resources/user'
import { studentRouter } from './resources/student'
import { apiErrorHandler } from './modules/errorHandler'

export const restRouter = express.Router()

restRouter.use('/user', userRouter)
restRouter.use('/student', studentRouter)
restRouter.use(apiErrorHandler)
