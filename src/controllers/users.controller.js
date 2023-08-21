import usersService from '../services/users.service.js'
import db from '../database/db.connection.js'

export const getTimelinePosts = async (req, res) => {
   const { userID } = res.locals
   const { offset } = req.query

   try {
      const posts = await usersService.getTimelinePosts(offset, userID)
      res.send(posts)
   } catch (err) {
      res.status(500).send(err.message)
   }
}

export const getPostsByUser = async (req, res) => {
   const { id } = req.params
   try {
      const result = await usersService.userPosts(id)
      res.status(200).send(result.rows)
   } catch (err) {
      res.status(500).send({ message: 'Error getting hashtag posts: ' + err.message })
   }
}

export const getPostsBySearch = async (req, res) => {
   res.send(req.body)
}

export const getUsersBySearch = async (req, res) => {
   const { search } = req.params

   try {
      const users = await usersService.getUsersBySearch(search)
      res.status(200).send(users.rows)
   } catch (error) {
      res.status(500).send(error)
   }
}
