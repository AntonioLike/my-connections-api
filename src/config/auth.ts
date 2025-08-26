import "dotenv/config";

const key = process.env.SECRET_KEY
if (!key) {
    throw new Error("SECRET_KEY is not set")
}
export const SECRET_KEY = key
export const JWT_ISSUER = "myconnections-api"
export const JWT_AUDIENCE = "myconnections-app"
export const JWT_EXPIRES = "1h"
