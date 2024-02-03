import React, { useEffect, useState } from "react";
import PostItem from "../component/PostItem";
import { useParams } from "react-router-dom";
import Loader from "../component/Loader";
import axios from "axios";

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const {id} = useParams()
  
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`);
        setPosts(response?.data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
      // console.log(posts[0].creator)
    };
    fetchPosts();
  }, [id]);  // here id is dependency array ????

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="posts">
      {posts.length > 0 ? (
        <div className="container post__container">
          {posts.map(
            ({
              _id: id,
              thumbnail,
              category,
              title,
              description,
              creator,
              createdAt,
            }) => (
              <PostItem
                key={id}
                id={id}
                thumbnail={thumbnail}
                category={category}
                title={title}
                description={description}
                authorID={creator}
                createdAt={createdAt}
              />
            )
          )}
        </div>
      ) : (
        <h2 className="center"> No Posts found!</h2>
      )}
    </section>
  );
};

export default AuthorPosts;
