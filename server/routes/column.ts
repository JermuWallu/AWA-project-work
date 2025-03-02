import { Request, Response, Router } from 'express'
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { validateToken } from '../middleware/validateToken'
import {User, IUser} from '../models/User';

const router: Router = Router()



export default router