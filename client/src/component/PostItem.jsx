import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostAuthor from './PostAuthor'
import axios from 'axios';




const PostItem = ({id, thumbnail,category,title,description,authorID,createdAt}) => {
  const shortDescription = description.length > 145 ? description.substr(0,150) + '...' : description;
  const shortTitle = title.length > 60 ? title.substr(0,30) + '...' : title;
  const [image, setImage] =useState();

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/image/${thumbnail}`,{responseType: 'blob'})
        const blobUrl = URL.createObjectURL(response.data);
        setImage(blobUrl)
      } catch (error) {
        console.log(error)
      }
    } 
    loadImage()
  },[])


  return (
    <article className="post">
      <div className="post__thumbnail">
        <img src={image} alt={title} />

      </div>
      <div className="post__content">
        <Link to={`/post/${id}`}>
          <h3>{shortTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{__html: shortDescription}}/>
        <div className="post__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt}  />
          <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
        </div>
      </div>
    </article>
  )
}

export default PostItem