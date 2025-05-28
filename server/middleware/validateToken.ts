import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export interface CustomRequest extends Request {
    user?: JwtPayload
    email?: string
}

export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const token: string | undefined = req.header('authorization')?.split(" ")[1]

    if(!token) {
        console.log("No token provided")
        res.status(401).json({message: "Access denied, missing token"})
        return
    }
    try {
        const verified: JwtPayload = jwt.verify(token, process.env.SECRET as string) as JwtPayload
        req.user = verified
        next()

    } catch (error: any) {
        console.log("Invalid token provided")
        res.status(401).json({message: "Access denied, invalid token"})
    }
}