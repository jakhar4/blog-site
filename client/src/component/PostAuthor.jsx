import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import avatar from '../images/avatar1.jpg'
import axios from 'axios'
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)

const PostAuthor = (props) => {

  const [author, setAuthor] = useState({})

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${props.authorID}`)
        // console.log(response.data)
        setAuthor(response?.data);
      } catch (error) {
        console.log(error)
      }
    }
    getAuthor();
  },[])

  // const [image, setImage] =useState();

  // useEffect(() => {
  //   const loadImage = async () => {
  //     try {
  //       const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/image/${author?.avatar}`,{responseType: 'blob'})
  //       const blobUrl = URL.createObjectURL(response.data);
  //       setImage(blobUrl)
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   } 
  //   loadImage()
  // },[])

  
  // console.log(props.authorID) 
  return (
    <Link to={`/posts/users/${props.authorID}`} className='post__author' >
      <div className="post__author-avatar">
        <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author?.avatar}`} alt="" />
        {/* <img src={avatar} alt="" /> */}
      </div>
      <div className="post__author-details">
        <h5>By: {author?.name}</h5>
        <small>  <ReactTimeAgo date={new Date(props.createdAt)} locale="en-US"/>  </small>
      </div>
    </Link>
  )
}

export default PostAuthor