import React, { ChangeEvent, useState } from 'react';
import { TextareaAutosize } from '@material-ui/core';
import './CreatePost.css';
import StyledButton from './StyledButton';
import { Post, FileType } from './Post';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

type CreatePostProps = {
  addPost: (post: Post) => void,
  isOpen: boolean,
  close: () => void
}

type UploadMethod = "URL" | "File";

const CreatePost = (props: CreatePostProps) => {
  const { addPost, isOpen, close } = props;

  const [type, setType] = useState<FileType>("Image");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("URL");

  const onChangeTitle = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = event.target.value;
    setTitle(input);
  };

  const onChangeBody = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = event.target.value;
    setBody(input);
  };

  const onChangeType = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as FileType);
  };

  const onChangeUploadMethod = (event: React.ChangeEvent<{ value: unknown }>) => {
    setUploadMethod(event.target.value as UploadMethod);
  };

  function onChangeFile(e: React.ChangeEvent<HTMLInputElement>): void {
    const fileList: FileList | null = e.target.files;
    if (fileList !== null) {
      const files: File[] = Array.from(fileList);
      const selectedFile = files[0];
      setFileURL(URL.createObjectURL(selectedFile));
    }
  }

  const onChangeFileURL = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = event.target.value;
    setFileURL(input);
  };

  const createPost = () => {
    const post: Post = {
      type: type,
      title: title,
      body: body,
      altText: 'unknown image',
      author: 'Helen',
      comments: [],
      votes: 0
    };
    if (fileURL) {
      post.fileURL = fileURL;
    }
    addPost(post);
  }

  const clearAndClose = () => {
    setType("Image");
    setTitle("");
    setBody("");
    setFileURL("");
    setUploadMethod("URL");
    close();
  }

  const acceptedFileType = type.toLowerCase() + "/*";

  return (
    <Dialog open={isOpen} onClose={clearAndClose} maxWidth="lg" fullWidth={true} aria-labelledby="dialog-title">
      <div style={{ padding: 24 }}>
        <h1 id="dialog-title">Create a new post</h1>
        <h2>Media type</h2>
        <RadioGroup aria-label="Media type" name="media" value={type} onChange={onChangeType}>
          <FormControlLabel value="Image" control={<Radio autoFocus={true} disabled={fileURL !== ""} />} label="Image" />
          <FormControlLabel value="Audio" control={<Radio disabled={fileURL !== ""} />} label="Audio" />
          <FormControlLabel value="Video" control={<Radio disabled={fileURL !== ""} />} label="Video" />
        </RadioGroup>

        <h2>Title</h2>
        <input
          className="input-box"
          value={title}
          onChange={onChangeTitle}
          placeholder="Post title"
          required={true}
        />
        <br />
        <h2>Post body</h2>
        <TextareaAutosize
          className="input-box"
          value={body}
          onChange={onChangeBody}
          placeholder="Post body"
        />
        <h2>Upload media file or URL</h2>
        <RadioGroup aria-label="Media upload method" name="media-upload" value={uploadMethod} onChange={onChangeUploadMethod}>
          <FormControlLabel value="URL" control={<Radio />} label="Input URL" />
          <FormControlLabel value="File" control={<Radio />} label="Upload file" />
        </RadioGroup>
        {
          uploadMethod === "URL" &&
          <input
            className="input-box"
            value={fileURL}
            onChange={onChangeFileURL}
            placeholder="Input or paste URL"
            accept={acceptedFileType}
          />
        }
        {
          uploadMethod === "File" &&
          <input id="file-input" type="file" onChange={onChangeFile} accept={acceptedFileType}></input>
          //<FileUpload setFile={onChangeFile} fileType={type}></FileUpload>
        }
        {fileURL && <h2>Selected file</h2>
        }
        {fileURL && type === "Image" &&
          <img src={fileURL} alt="unknown" width={200} height={200} ></img>
        }
        {fileURL &&
          type === "Audio" &&
          <audio controls>
            <source src={fileURL} />
          </audio>
        }
        {fileURL &&
          type === "Video" &&
          <video controls width="100%">
            <source src={fileURL} />
          </video>
        }
        <StyledButton
          variant="contained"
          color="primary"
          onClick={createPost}>
          Submit Post
        </StyledButton>
        <StyledButton
          onClick={clearAndClose}>
          Cancel
        </StyledButton>
      </div>
    </Dialog>
  );
}

export default CreatePost;