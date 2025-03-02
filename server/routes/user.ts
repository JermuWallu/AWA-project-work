import { Request, Response, Router } from 'express'
// import { body, Result, ValidationError, validationResult } from 'express-validator' // ei toimi jostain syystä
import bcrypt from 'bcrypt'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { validateToken } from '../middleware/validateToken'
import {User, IUser} from '../models/User';

const router: Router = Router()

router.post("/register", 
    async (req: Request, res: Response) => {
        try {
            const existingUser: IUser | null = await User.findOne({ email: req.body.email })
            if (existingUser) {
                res.status(403).json({email: "email already in use"})
                return
            }

            const salt: string = bcrypt.genSaltSync(10)
            const hash: string = bcrypt.hashSync(req.body.password, salt)

            User.create({email: req.body.email, password: hash})

            res.status(200).json({message: "User registered successfully"})
            return

        } catch (error: any) {
            console.error(`Error during registration: ${error}`)
            res.status(500).json({error: "Internal Server Error"})
            return
        }

    }
)

router.get("/list", 
    async (req: Request, res: Response) =>{
        res.status(200).json(User)
    }
)

router.post("/login",
    async (req: Request, res: Response) => {
        try {
            const user: IUser | null = await User.findOne(req.body.email)

            console.log("User:", user)

            if (!user) {
                res.status(401).json({message: "Login failed"})
                return
            }

            if (bcrypt.compareSync(req.body.password, user.password)) {
                const jwtPayload: JwtPayload = {
                    email: user.email
                }
                const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "2m"})

                res.status(200).json({success: true, token})
                return
            }
            res.status(401).json({message: "Login failed"})
            return


        } catch(error: any) {
            console.error(`Error during user login: ${error}`)
            res.status(500).json({ error: 'Internal Server Error' })
            return
        }
    }
)

router.get("/private", 
    validateToken, 
    async (req: Request, res: Response) => {
        res.status(200).json({message: "This is protected secure route!"})
    }
)

export default router