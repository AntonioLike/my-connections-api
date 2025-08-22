// middleware/authenticateToken.ts
import { Request, Response, NextFunction } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"
import userService from "../services/userService"

declare module "express-serve-static-core" {
    interface Request {
        userId?: string
        tokenPayload?: JwtPayload & { email?: string; role?: string }
        user?: any
    }
}

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    if (process.env.DISABLE_AUTH === "TRUE") return next()

    const SECRET_KEY = process.env.SECRET_KEY
    if (!SECRET_KEY) throw new Error("SECRET_KEY is not defined")

    const authHeader = req.headers.authorization || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""

    if (!token) return res.status(401).json({ message: "Access denied. No token provided." })

    try {
        const payload = jwt.verify(token, SECRET_KEY, {
            issuer: "myconnections-api",
            audience: "myconnections-app",
        }) as JwtPayload

        const userId = (payload.sub as string) || (payload as any).userToken
        if (!userId) return res.status(403).json({ message: "Invalid token payload" })

        req.userId = userId
        req.tokenPayload = payload

        const user = await userService.getUserByUserToken(userId)
        if (!user) return res.status(401).json({ message: "user-not-found" })
        req.user = user

        next()
    } catch {
        return res.status(403).json({ message: "Invalid token" })
    }
}

export default authenticateToken;
