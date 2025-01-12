const User = require("../models/user.model");
const cloudinary = require("cloudinary");
const Post = require("../models/postSchema.model");
const notificationModel = require("../models/notification.model");

module.exports.createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;

    let userId = req.user._id;
    let user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!text && !img) {
      return res.status(400).json({ error: "Text and image required to post" });
    }

    if (img) {
      let uploadedRes = cloudinary.uploader.upload(img);
      img = uploadedRes.secure_url;
    }

    let newPost = new Post({
      user: userId,
      text,
      img,
    });

    await newPost.save();

    res.status(201).json({ Message: "New post created successfully" });
  } catch (err) {
    console.log(`Error in create Post controller,${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ _id: id });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this post" });
    }

    if (post.img) {
      await cloudinary.uploader.destroy(
        post.img.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.log(`Error in delete post controller,${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports.createComment = async (req, res) => {
  try {
      
    const {id} = req.params;
    const {text} = req.body
    const userId = req.user._id;
    
    if(text){
        return res.status(400).json({error:"Comment text required to post"})
    }

    const post = await Post.findOne({_id:id});

    if(!post){
        return res.status(404).json({error:"Post not found"})
    }

    const commentObj = {
        text,
        user: userId
    }

    post.comments.push(commentObj);
    await post.save()


    const newNotification = new notificationModel({
      from: req.user._id,
      to: post.user,
      type: "comment",
    });

    await newNotification.save();

    res.status(200).json({message:"comment successful on post",updatedComment: post.comments})

  } catch (err) {
    console.log(`Error in create comment controller,${err}`);
    res.status(500).json({ error: "Internal server error" });
  }
};


module.exports.likeUnlikePost = async (req,res) =>{
    try{

        const userId = req.user._id;
        const {id: postId} = req.params;

        const post = await Post.findOne({_id:postId});
        if(!post){
            return res.status(404).json({error:"Post not found"})
        }
        const userAlreadyLiked = post.likes.includes(userId.toString());

        if(userAlreadyLiked){


          await Post.updateOne({_id:postId},{$pull :{likes: userId}})
          await User.updateOne({_id:userId},{$pull:{likedPosts:postId}})

             let updatedLikes = post.likes.filter(like => like.toString !== userId.toString())

             return res.status(200).json({message:"Post unliked successfully",updatedLikes})

        }else{

            post.likes.push(userId);
            await post.save()

            await User.updateOne({_id:userId},{$push:{likedPosts:postId}})

            const newNotification = new notificationModel({
                from: userId,
                to: post.user,
                type: "like",
              });
          
              await newNotification.save();

              res.status(200).json({message:"Post liked successfully",updatedLikes: post.likes})

        }

    }catch(err){
        console.log(`Error in like and unlike controller,${err}`);
    res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.getAllPosts = async (req,res) =>{
    try{

        const posts = await Post.find().sort({createdAt:-1}).populate({
            path: 'User',
            select: "-password"
        }).populate({
            path:"comments.user",
            select: ['-password','-bio','-link','-followers','-following','-email']
        });

        if(posts.length === 0){
           return res.status(200).json([])
        }

        res.status(200).json({message:'Posts fetch success',posts})

    }catch(err){
        console.log(`Error in get all posts controller,${err}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.getLikedPosts = async (req,res) =>{

    try{
         const {id: userId} = req.params;
         const user = await User.findOne({_id: userId});

         if(!user){
            return res.status(404).json({error:"User not found"})
         }

         const likedPosts = await Post.find({_id: {$in : user.likedPosts}}).populate({
            path: 'User',
            select: "-password"
        }).populate({
            path:"comments.user",
            select: ['-password','-bio','-link','-followers','-following','-email']
        })

        res.status(200).json({message:"liked posts fetch success",likedPosts})
    }catch(err){
        console.log(`Error in get liked posts controller,${err}`);
        res.status(500).json({ error: "Internal server error" });
    }

}

module.exports.getFollowingPosts  = async (req,res) =>{

    try{

        const userId = req.user._id;
        const user = await  User.findOne({_id:userId});

        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        const following = user.following;

        const postsOfFollowing = await Post.find({user :{$in : following}}).sort({createdAt: -1}).populate({
            path: 'User',
            select: "-password"
        }).populate({
            path:"comments.user",
            select: ['-password','-bio','-link','-followers','-following','-email']
        })

        res.status(200).json({message:"Posts of users following fetch success",postsOfFollowing});

    }catch(err){
        console.log(`Error in get following posts controller,${err}`);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports.getUserPost = async (req,res) =>{

    try{

        const {username} = req.params;
        const user = await User.findOne({username:username});

        if(!user){
            return res.status(404).json({error:"User not found"})
        }

        const posts = await Post.find({user: user._id}).sort({createdAt: -1}).populate({
            path: 'User',
            select: "-password"
        }).populate({
            path:"comments.user",
            select: ['-password','-bio','-link','-followers','-following','-email']
        })

        res.status(200).json({message:"User posts fetch success",posts})

    }catch(err){
        console.log(`Error in get user post controller,${err}`);
        res.status(500).json({ error: "Internal server error" });
    }
}