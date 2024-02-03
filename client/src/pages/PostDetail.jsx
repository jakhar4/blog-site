import React, { useContext, useEffect, useState } from "react";
import PostAuther from "../component/PostAuthor";
import { Link, useParams } from "react-router-dom";
import Loader from "../component/Loader";
import DeletePost from './DeletePost'
import { UserContext } from "../context/userContext";
import axios from "axios";

const PostDetail = () => {
  const {id} = useParams()
  const [post, setPost] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const [image, setImage] = useState()
  const {currentUser} = useContext(UserContext)

  useEffect(()=>{
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setPost(response.data)
        const responseForImage = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/image/${post.thumbnail}`,{responseType: 'blob'})
        const blobUrl = URL.createObjectURL(responseForImage.data);
        setImage(blobUrl)
      } catch (error) {
        setError(error)
      }
      setIsLoading(false);
    }
    getPost()
  },[])

  if(isLoading){
    return <Loader/>
  }
  // const authorID = post?.creator
  // console.log(authorID)

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {post && <div className="container post-detail__container">
        <div className="post-detail__header">
          <PostAuther createdAt={post.createdAt} authorID={post?.creator} />
          {
            currentUser?.id == post?.creator && 
            <div className="post-detail__buttons">
              <Link to={`/post/${post?._id}/edit`} className="btn sm primary">
                Edit
              </Link>
              <DeletePost postId={id}/>
            </div>
          }
        </div>
        <h1>{post.title}</h1>
        <div className="post-detail__thumbnail">
          <img src={image} alt="" />
        </div>
        <p dangerouslySetInnerHTML={{__html: post.description}} ></p>
      </div>}
    </section>
  );
};

export default PostDetail;
