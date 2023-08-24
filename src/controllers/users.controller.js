import usersService from '../services/users.service.js'
import jwt from 'jsonwebtoken'

export const countTimelinePosts = async (req, res) => {
   try {
      const counter = await usersService.countTimelinePosts()
      res.send({ counter })
   } catch (err) {
      res.status(500).send(err.message)
   }
}

export const getTimelinePosts = async (req, res) => {
   const { userID } = res.locals
   const { limit } = req.query

   try {
      const posts = await usersService.getTimelinePosts(limit, userID)
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

export const getUsersBySearch = async (req, res) => {
   const { search } = req.params
   const str = search.split(',')[0]
   const userID = search.split(',')[1]
   
   try {
      const users = await usersService.getUsersBySearch(str, userID)

      res.status(200).send(users.rows)
   } catch (error) {
      res.status(500).send(error)
   }
}

export const postFollow = async (req, res) => {
   const { follower } = req.body
   const { userID } = res.locals

   try {
      const result = await usersService.follow(userID, follower)

      res.status(200).send(result)
   } catch (err) {
      console.log(err)
      res.status(500).send({ message: err.message })
   }
}

export const checkFollow = async (req, res) => {
   const { id } = req.params
   const { userID } = res.locals
   try {
      const result = await usersService.followCheck(userID, id)

      res.status(200).send(result)
   } catch (err) {
      res.status(500).send({ message: err.message })
   }
}

export const postLike = async (req, res) => {
   const { token, postID } = req.body
   const userID = jwt.verify(token, process.env.JWT_SECRET || 'test').id

   try {
      const rq = await usersService.postLike({ userID, postID })

      res.status(200).send(rq)
   } catch (error) {
      res.status(500).send(error)
   }
}
