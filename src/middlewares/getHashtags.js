export const getHashtags = (req, res, next) => {
    
    const { description } = req.body;
    const hashtags = description.split(' ').filter(text => text.startsWith('#'));

    res.locals.hashtags = hashtags;
    next();
}