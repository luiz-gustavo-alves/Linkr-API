import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import authService from '../services/auth.service.js'

dotenv.config()

export const signIn = async (req, res) => {
   try {
      const reqSign = await authService.login(req.body)

      if (!reqSign.success) return res.status(404).send('E-mail ou senha incorretos!')

      const { id, imageURL } = reqSign.data

      const authToken = jwt.sign({ id }, process.env.JWT_SECRET || 'test', {
         expiresIn: '1y',
         subject: '1'
      })

      res.status(200).send({ authToken, imageURL })
   } catch (err) {
      res.status(500).send(err.message)
   }
}

export const signUp = async (req, res) => {
   const { email } = req.body

   try {
      const checkEmailConflict = await authService.findEmail(email)

      if (checkEmailConflict)
         return res.status(401).send('O e-mail informado já está em uso. Tente novamente!')

      await authService.register(req.body)

      res.sendStatus(201)
   } catch (error) {
      res.status(500).send(error)
   }
}

export const logout = async (req, res) => {
   res.send(req.body)
}
