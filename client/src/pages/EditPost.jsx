import React, { useState, useContext, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import {UserContext} from '../context/userContext'
import {useNavigate, useParams} from 'react-router-dom'
import axios from 'axios'

/* bubble and core also theme of css of react-quill */

const EditPosts = () => {
  const [title,setTitle] =useState('')
  const [category,setCategory] = useState('Uncategorised')
  const [description,setDescription] = useState('')
  const [thumbnail,setThumbnail] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate();
  const {id} = useParams();

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;

  // redirect to login page for any user who isn't logged in
  useEffect(()=>{
    if(!token){
      navigate('/login')
    }
  }, [])


  const modules ={
    toolbar:[
      [{'header': [1, 2, 3,4,5,6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
  ]}
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ]
  const POST_CATEGORIES = ["Uncategorized","Agriculture", "Business", "Education", "Entertainment", "Art", "Investment",  "Weather"]

  useEffect(() => {
    const getPost = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)

        setTitle(response.data.title)
        setDescription(response.data.description)

      } catch (err) {
        setError(err.response.data.message)
      }
    }
    getPost();

  },[])

  const editPost = async (e) => {
    e.preventDefault();

    const postData = new FormData();
    postData.set('title',title)
    postData.set('category',category)
    postData.set('description',description)
    postData.set('thumbnail',thumbnail)

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, postData, {withCredentials:true, headers: {Authorization: `Bearer ${token}`}})

      if(response.status == 200){
        return navigate('/')
      }
    } catch (err) {
      setError(err.response.data.message);
    }
  }




  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit post</h2>
        {error && <p className="form__error-message">{error}</p>}
        <form onSubmit={editPost} className="form create-post__form">
          <input type="text" name="" id="" placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} autoFocus/>
          <select name="category" id="" value={category} onChange={e => setCategory(e.target.value)} >
            {
              POST_CATEGORIES.map(cat => <option key={cat}>{cat}</option>)
            }
          </select>
          <input type="file" onChange={e => setThumbnail(e.target.files[0])} accept='png, jpg, jpeg' />
            <ReactQuill  theme='snow' modules={modules} formats={formats} value={description} onChange={setDescription} ></ReactQuill>
            <button type="submit" className='btn primary'>Update</button>
        </form>
      </div>
    </section>
  )
}

export default EditPosts



// react-quill 