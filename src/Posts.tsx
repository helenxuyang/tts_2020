import React, { useState } from 'react';
import { Post } from './Post';
import PostCard from './PostCard';
import PostPage from './PostPage';

type PostsProps = {
  posts: Post[]
}
const Posts = (props: PostsProps) => {
  const posts = props.posts;
  const [openPostIndex, setOpenPostIndex] = useState(-1);

  return <div>
    <h2>Posts</h2>
    {
      posts.map((post, index) =>
        (openPostIndex === -1) ?
          <PostCard
            key={post.title}
            post={post}
            openPost={() => setOpenPostIndex(index)}
          /> :
          <PostPage
            post={posts[openPostIndex]}
            isOpen={openPostIndex === index}
            close={() => setOpenPostIndex(-1)}
          />)
    }
  </div>;
}

export default Posts;