const express = require('express');

const protectGetMeRoute = require('../middlewares/protectGetMeRoute');
const {
    createPost,
    deletePost,
    createComment,
    likeUnlikePost,
    getAllPosts,
    getLikedPosts,
    getFollowingPosts,
    getUserPost
} = require('../controllers/post.controller');

const router = express.Router();

router.get('/all',protectGetMeRoute,getAllPosts);

router.get('/user/:username',protectGetMeRoute,getUserPost)

router.get('/following',protectGetMeRoute,getFollowingPosts)

router.get('/likedposts/:id',protectGetMeRoute,getLikedPosts);

router.post('/create',protectGetMeRoute,createPost);

router.delete('/:id',protectGetMeRoute,deletePost);

router.post('/comment/:id',protectGetMeRoute,createComment);

router.post('/like/:id',protectGetMeRoute,likeUnlikePost);

module.exports = router;