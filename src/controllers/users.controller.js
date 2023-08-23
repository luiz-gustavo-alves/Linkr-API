import usersService from '../services/users.service.js'
import jwt from 'jsonwebtoken'

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

export const getUsersBySearch = async (req, res) => {
   const { search } = req.params

   try {
      const users = await usersService.getUsersBySearch(search)
      res.status(200).send(users.rows)
   } catch (error) {
      res.status(500).send(error)
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

export const postFollow = async (req, res) => {

   const { follower } = req.body;
   const { userID } = res.locals;

   try {

      const result = await usersService.follow(userID, follower);

      res.status(200).send(result);

   } catch (err) {
      console.log(err);
      res.status(500).send({ message: err.message });
   }
}

/*
  1 | Ze
  2 | zeca
  3 | geraldogomesss
  4 | luiz
  5 | lucas
  6 | geraldo
  7 | luiz
  8 | lucas
  9 | gerlandio

 */

/*
    3 | Pokémon Ruby, Sapphire & Emerald - Team Aqua/Magma Music (HQ)
  5 | Em guerra com o Santos, Zeca está na mira do Palmeiras
  8 | Figma
  9 | Figma
 12 | Example Domain

  */

 // INSERT INTO likes (userID, postID) VALUES (3, 5);