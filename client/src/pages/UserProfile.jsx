import React, { useState, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

// import Avatar from '../images/avatar12.jpg'

import {UserContext} from '../context/userContext'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

const UserProfile = () => {
  const [avatar,setAvatar] = useState('')
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [currentPassword,setCurrentPassword]=useState('')
  const [newPassword,setNewPassword]=useState('')
  const [confirmNewPassword,setConfirmNewPassword]=useState('')
  const [error, setError] = useState('');
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);



  const navigate = useNavigate();
  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;

  const [image, setImage] =useState();


  // redirect to login page for any user who isn't logged in
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}});
      const {name, email, avatar} = response.data;
      setName(name);
      setEmail(email);
      setAvatar(avatar);
      // to fetch image
      const responseForImage = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/image/${avatar}`,{responseType: 'blob'})
      const blobUrl = URL.createObjectURL(responseForImage.data);
      setImage(blobUrl)
    }
    getUser();
  },[])


  
  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avatar', avatar);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
      console.log('donje')
      setAvatar(response?.data.avatar)

    } catch (err) {
      console.log(err)
    }
  }


  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
          
        const userData = new FormData();
        userData.set('name', name);
        userData.set('email', email);
        userData.set('currentPassword', currentPassword);
        userData.set('newPassword', newPassword);
        userData.set('newConfirmNewPassword', confirmNewPassword);

        const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})
        if(response.status == 200){
          //log user out
          navigate('/logout')
        }
    } catch (err) {
      setError(err.response.data.message);
    }


  }

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.id}`} className='btn'>My Posts</Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={image} alt="" />
            </div>
            {/* form to update avatar*/}
            <form onSubmit={changeAvatarHandler} className="avatar__form">
              <input type='file' name='avatar' id='avatar' onChange={e => setAvatar(e.target.files[0])} accept="png,jpg,jpeg"/>
              <label htmlFor='avatar' onClick={()=>{setIsAvatarTouched(true)}}><FaEdit /></label>
            </form>
            {isAvatarTouched && <button className="profile__avatar-btn" ><FaCheck /></button>}
          </div>
          <h1>{currentUser.name}</h1>
          {/* form to update user details */}
          <form action=""  className="form profile__form" onSubmit={updateUserDetails}>
          {error && <p className="form__error-message">{error}</p>}
          <input type="text" name="" id="" placeholder='Full Name' value={name} onChange={e=>setName(e.target.value)}/>
          <input type="text" name="" id="" placeholder='Email' value={email} onChange={e=>setEmail(e.target.value)}/>
          <input type="text" name="" id="" placeholder='Current Password' value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)}/>
          <input type="text" name="" id="" placeholder='New Password' value={newPassword} onChange={e=>setNewPassword(e.target.value)}/>
          <input type="text" name="" id="" placeholder='Confirm New Password' value={confirmNewPassword} onChange={e=>setConfirmNewPassword(e.target.value)}/>
          <button type="submit" className="btn primary">Update details</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserProfile