import db from "../../database/db.connection.js";
import usersService from "../../services/users.service.js";

export default async function addComments(posts, userID){
   const AllComments = await usersService.getAllComments();

   const following = await db.query(`SELECT * FROM follows WHERE "userID_following" = $1`, [userID]);

   const followingIDs = following.rows.map(row => row.userID_follower);

   const postsWithComments = posts.map( p => {
      
      const comments = AllComments.filter( c => c.postID == p.postID);

      const commentsFilter = comments.map( c => {
         let type;
         
         if(c.user.id === p.user.id){
            type = "owner";
         }
         else if (followingIDs.find((id) => id == c.user.id)){
            type = "follower";
         }
         else{
            type = "notFollower";
         }
         
         return {
            ...c,
            type: type
          };
      })

      return {
        ...p,
        comments: commentsFilter
      }
   })
   return postsWithComments;
}