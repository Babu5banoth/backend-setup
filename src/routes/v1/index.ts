import {Router } from 'express'
import AuthRoutes from './auth'


const router = Router()

router.use('/auth', AuthRoutes) //api/v1/auth/signup

export default router;