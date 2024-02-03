import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import './index.css'
import UserProvider from './context/userContext';

import Layout from './component/Layout';
import ErrorPage from './pages/ErrorPage';
import Home from './pages/Home'
import PostDetail from './pages/PostDetail'
import Login from './pages/Login'
import UserProfile from './pages/UserProfile'
import Authors from './pages/Authors'
import Create from './pages/CreatePosts'
import CategoryPosts from './pages/CategoryPosts'
import AutherPost from './pages/AuthorPosts'
import DashBoard from './pages/Dashboard'
import EditPost from './pages/EditPost'
import DeletePost from './pages/DeletePost'
import Logout from './pages/Logout'
import Register from './pages/Register'


const router = createBrowserRouter([
  {
    path:"/",
    element:<UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage/>,
    children:[
      {index: true ,element: <Home />},
      {path: 'post/:id' ,element: <PostDetail />},
      {path: 'register' ,element: <Register />},
      {path: 'login' ,element: <Login />},
      {path: 'profile/:id' ,element: <UserProfile />},
      {path: 'authors' ,element: <Authors />},
      {path: 'create' ,element: <Create />},
      {path: 'posts/categories/:category' ,element: <CategoryPosts />},
      {path: 'posts/users/:id' ,element: <AutherPost />},
      {path: 'myposts/:id' ,element: <DashBoard />},
      {path: 'post/:id/edit' ,element: <EditPost />},
      {path: 'post/:id/delete' ,element: <DeletePost />},
      {path: 'logout' ,element: <Logout />}
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
