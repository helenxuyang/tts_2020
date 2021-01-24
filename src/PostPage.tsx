import React, { ChangeEvent, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { Post, Comment } from './Post';
import Button from '@material-ui/core/Button';
import { DialogContent } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

type PostPageProps = {
  post: Post,
  isOpen: boolean,
  close: () => void
}

const PostPage = (props: PostPageProps) => {
  const { post, isOpen, close } = props;
  const [commenting, setCommenting] = useState(false);
  const [comment, setComment] = useState('');

  const onChangeComment = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = event.target.value;
    setComment(input);
  };

  const addComment = (comment: Comment) => {
    post.comments = [...post.comments, comment];
  }

  const postComment = () => {
    const newComment = {
      author: 'Helen',
      body: comment,
      votes: 0
    };
    addComment(newComment);
    setCommenting(false);
  }
  return (
    <Dialog open={isOpen} onClose={close} maxWidth="md" fullWidth={true} aria-labelledby="dialog-title">
      <div style={{ padding: 24 }}>
        <IconButton aria-label="close" onClick={close} style={{ width: 64, height: 64 }}>
          <CloseIcon />
        </IconButton>
        <h1 id="dialog-title">{`[${post.type}] ${post.title}`}</h1>
        {post.type === "Image" &&
          <img src={post.fileURL} alt={post.altText} width="100%" ></img>}
        {post.type === "Audio" &&
          <audio controls style={{ width: "100%" }}>
            <source src={post.fileURL} />
          </audio>}
        {post.type === "Video" &&
          <video controls width="100%">
            <source src={post.fileURL} />
          </video>}
        <i>{'Author: ' + post.author}</i>
        <p>{post.body}</p>
        <Button autoFocus={true} onClick={() => setCommenting(true)}>Add a comment</Button>

        {commenting && <input
          className="input-box"
          value={comment}
          onChange={onChangeComment}
          placeholder="Leave a comment"
        />}
        {commenting && <Button onClick={postComment}>Post comment</Button>}
        <h3>{post.comments.length + ' comment' + (post.comments.length === 1 ? ':' : 's:')}</h3>
        {post.comments.map((comment) =>
          <div>
            <h4>{comment.author}</h4>
            <p>{comment.body}</p>
          </div>
        )}
      </div>
    </Dialog>
  );
}

export default PostPage;
