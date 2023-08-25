import usersService from '../services/users.service.js'
import jwt from 'jsonwebtoken'
import addComments from '../utils/comments/index.js';

export const countTimelinePosts = async (req, res) => {

   const { userID } = res.locals;

   try {
      const counter = await usersService.countTimelinePosts(userID);
      res.send({counter});
   } catch (err) {
      res.status(500).send(err.message);
   }
}

export const getTimelinePosts = async (req, res) => {
   const { userID } = res.locals;
   const { limit } = req.query;

   try {
      const posts = await usersService.getTimelinePosts(limit, userID);
      const postsWithComments = await addComments(posts, userID);

      res.status(200).send(postsWithComments);
   } catch (err) {
      res.status(500).send(err.message)
   }
}

export const getPostsByUser = async (req, res) => {
   const { id } = req.params;
   const { userID } = res.locals

   try {
      const result = await usersService.userPosts(id);

      const resultWithComments = await addComments(result.rows, userID);

      res.status(200).send(resultWithComments);
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

export const checkFollow = async (req, res) => {

   const { id } = req.params;
   const { userID } = res.locals;
   try {

      const result = await usersService.followCheck(userID, id);

      res.status(200).send(result);

   } catch (err) {
      res.status(500).send({ message: err.message });
   }
}

export const postLike = async(req, res) => {

   const {token, postID} = req.body
   const userID = jwt.verify(token, process.env.JWT_SECRET || 'test').id

   try {

      const rq = await usersService.postLike({userID, postID})


      res.status(200).send(rq)
      
   } catch (error) {
      res.status(500).send(error)
   }
}

export const commentPost = async (req, res) => {

   const { userID } = res.locals;
   const {userID_owner, postID, comment} = req.body;

   try {
       await usersService.createComment(userID_owner, userID, postID, comment);
       res.sendStatus(201);

   } catch (err) {
       res.send(err.message);
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