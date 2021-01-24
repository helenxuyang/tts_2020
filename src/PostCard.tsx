import React from 'react';
import Card from '@material-ui/core/Card';
import { CardContent, CardMedia } from '@material-ui/core';
import { Button } from '@material-ui/core';
import { Post } from './Post';

type PostCardProps = {
  post: Post,
  openPost: () => void
}

const PostCard = (props: PostCardProps) => {
  const { post, openPost } = props;

  return (
    <Card className="post-card" style={{ display: "flex", margin: 16, padding: 16 }}>
      <CardMedia>
        {post.type === "Image" &&
          <img src={post.fileURL} alt={post.altText} width={200} height={200} ></img>}
        {post.type === "Audio" &&
          <audio controls style={{ width: 200 }}>
            <source src={post.fileURL} />
          </audio>}
        {post.type === "Video" &&
          <video controls width={200}>
            <source src={post.fileURL} />
          </video>}
      </CardMedia>
      <CardContent>
        <h2>{`[${post.type}] ${post.title}`}</h2>
        <i>{'Author: ' + post.author}</i>
        <p>{post.body}</p>
        <Button onClick={openPost}>
          {post.comments.length + ' comment' + (post.comments.length === 1 ? '' : 's')}
        </Button>
      </CardContent>
    </Card>
  );
}

export default PostCard;
