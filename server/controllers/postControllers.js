const Post =require("../models/postModel")
const User = require("../models/userModel")
const path = require("path")
const fs = require("fs")
const {v4:uuid} = require("uuid")
const HttpError =require("../models/errorModel")



// =================== CREATE POSTS
// POST : api/posts
// PROTECTED
const createPost = async (req, res, next) => {
    try {
        let {title, category, description} = req.body;
        if(!title || !category || !description || !req.files){
            return next(new HttpError("Fill in all fields and choose thumbnail.", 422))
        }
        const {thumbnail} = req.files;
        // res.status(200).json(thumbnail.name)

        // //check the file size
        if(thumbnail.size>2000000) {
            return next(new HttpError("Thumbnail should be less than 2mb"))
        }
        
        let fileName = thumbnail.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];
        thumbnail.mv(path.join(__dirname, "..", "/uploads", newFilename), async (err) => {
            if(err){
                return next(new HttpError(err))
            } 
            else {
                const newPost =await Post.create({title, category, description , thumbnail:newFilename, creator:req.user.id})
                if(!newPost){
                    return next(new HttpError("Post couldn't be created.",422))
                }

                //find user and increate post count bt 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts + 1;
                await User.findByIdAndUpdate(req.user.id, {posts:userPostCount});

                res.status(201).json(newPost)

            }
            // res.status(200).json(req.user.id)
        })







    } catch (error) {
        return next(new HttpError(error))
    }
}


// ===================GET ALL POSTS
// GET : api/posts
// UNPROTECTED
const getPosts =async(req, res, next) => {
    try {
        const posts = await Post.find().sort({updateAt: -1})
        res.status(200).json(posts)

    } catch (error) {
        return next(new HttpError(error))
    }
}


// ===================GET SINGLE POSTS
// GET : api/posts/:id
// UNPROTECTED
const getPost =async(req, res, next) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId)
        if(!post){
            return next(new HttpError("Post not found.",404))
        }
        res.status(200).json(post)
    } catch (error) {
        return next(new HttpError(error))
    }
}


// ===================GET POSTS BY CATEGORY
// GET : api/posts/categories/:category
// UNPROTECTED
const getCatPost =async(req, res, next) => {
    try {
        const {category} = req.params;
        const categoryPosts = await Post.find({category}).sort({createdAt: -1})
        if(!categoryPosts){
            return next(new HttpError("No post found for this category"),404)
        }
        res.status(200).json(categoryPosts)
    } catch (error) {
        return next(new HttpError(error))
    }
}


// ===================GET AUTHER POST
// GET : api/posts/users/:id
// UNPROTECTED
const getUserPost =async(req, res, next) => {
    try {
        const {id} = req.params;
        const posts = await Post.find({creator: id}).sort({createdAt: -1})
        if(!posts){
            return next(new HttpError("Currently has no posts for this author", 404))
        }
        res.status(200).json(posts)
    } catch (error) {
        return next(new HttpError(error))
    }
}


// =================== EDIT POST
// PATCH : api/posts/:id
// PROTECTED
const editPost =async(req, res, next) => {
    try {
        let newFileName;
        let updatedPost;
        const postId = req.params.id;
        let {title, category, description} = req.body;
// here decrption can't becheck using exist or not because of reactquill
        if(!title || !category || description.lenght<12){
            return next(new HttpError("Fill in all fields", 422))
        }
        //get old post from database 
        const oldPost = await Post.findById(postId);
        if(req.user.id == oldPost.creator){
        //if thumbnail remail same or not get updated by editor
        if(!req.files){
            updatedPost = await Post.findByIdAndUpdate(postId, {title , category, description}, {new:true})
        } else {
            //delete old thumbnail from upload
            fs.unlink(path.join(__dirname, '..', 'uploads', oldPost.thumbnail), async (err) =>{
                if(err){
                    return next(new HttpError(err))
                }
            })
            //upload new thumbnail
            const {thumbnail} = req.files;
            //check file size
            if(thumbnail.size > 200000){
                return next(new HttpError("Thumbnail's too big. Should be less than 2mb."))
            }
            const filename = thumbnail.name;
            const splittedFilename = filename.split('.');
            const newFileName = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length -1]
            thumbnail.mv(path.join(__dirname, '..', 'uploads', newFileName), async (err) =>{
                if(err){
                    return next(new HttpError(err))
                }
            })

            updatedPost = await Post.findByIdAndUpdate(postId, {title, category, description, thumbnail: newFileName}, {new:true})
        }}

        if(!updatedPost){
            return next(new HttpError("Couldn't update post.",400))
        }
        res.status(200).json(updatedPost)
    } catch (error) {
        return next(new HttpError(error))
    }
}


// ===================delete POST
// DELETE : api/posts/:id
// PROTECTED
const deletePost =async(req, res, next) => {
    try {
        const postId = req.params.id;
        if(!postId){
            return next(new HttpError("Post unavailable.",400))
        }
        const post = await Post.findById(postId)
        const fileName = post.thumbnail;
        if(req.user.id == post.creator){
        //delete thumbnail from uploads folder
        fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
            if(err){
                return next(new HttpError(err))
            } else {
                await Post.findByIdAndDelete(postId);
                // find user and reduce post count by 1
                const currentUser = await User.findById(req.user.id);
                const userPostCount = currentUser.posts -1;
                await User.findByIdAndUpdate(req.user.id, {posts: userPostCount})
                res.json(`Post ${postId} deleted succesfully`)
            }
        })
    } else {
        return next(new HttpError("Post couldn't be deleted", 403))
    }
        
    } catch (error) {
        return next(new HttpError(error))
    }
}


module.exports = {createPost, getPosts, getCatPost, getUserPost, getPost, editPost, deletePost}