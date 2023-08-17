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
   const req = await findEmail(payload.email)
   const password_encrypted = bcrypt.compareSync(payload.password, req.rows[0].password)

   if (!req || !password_encrypted) return { success: false }

   delete req.rows[0].password
   return { success: true, data: req.rows[0] }
}

const findEmail = async (email) => {
   const req = await db.query(
      `SELECT *
        FROM users
        WHERE email = $1
       `,
      [email]
   )

   return req.rows[0] ? true : false
}

const authService = {
   register,
   login,
   findEmail
}

export default authService
