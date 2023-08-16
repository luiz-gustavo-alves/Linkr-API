export const checkPostID = (req, res, next) => {

    const { postID } = req.params;
    if (!Number(postID)) {
        return res.sendStatus(403);
    }

    req.params.postID = Number(postID);
    next();
}