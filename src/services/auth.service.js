import bcrypt from 'bcrypt'
import db from '../database/db.connection.js'

const register = async (payload) => {
   const { name, email, imageURL, password } = payload
   const encryptedPassword = bcrypt.hashSync(password, 10)

   await db.query(
      `INSERT INTO users
          (name, email, "imageURL", password)
       VALUES ($1, $2, $3, $4);
      `,
      [name, email, imageURL, encryptedPassword]
   )
}

const login = async (payload) => {
   const userReq = await findEmail(payload.email)

   if (!userReq) return { success: false }

   const password_encrypted = bcrypt.compareSync(payload.password, userReq.password)

   if (!password_encrypted) return { success: false }

   delete userReq.password

   return { success: true, data: userReq }
}

const findEmail = async (email) => {
   const req = await db.query(
      `SELECT *
        FROM users
        WHERE email = $1
       `,
      [email]
   )

   return req.rows[0] ? req.rows[0] : false
}

const authService = {
   register,
   login,
   findEmail
}

export default authService
