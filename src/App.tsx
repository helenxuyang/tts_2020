import { useState } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import CreatePost from './CreatePost';
import Posts from './Posts';
import StyledButton from './StyledButton';
import { Post } from './Post';
import AzureAnalysis from './AzureAnalysis';
import VideoTranscribe from './VideoTranscribe';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#4300b8"
    },
    secondary: {
      main: "#2d007a"
    }
  }
});

export function App() {
  const [creatingPost, setCreatingPost] = useState(false);
  const [azureAnalyzing, setAzureAnalyzing] = useState(false);
  const [transcribingVideo, setTranscribingVideo] = useState(false);

  const tempPosts: Post[] = [
    {
      type: 'Image',
      author: 'Helen',
      title: 'programming humor Reddit meme',
      body: 'what is this meme? the comments are hilarious',
      fileURL: 'https://external-preview.redd.it/I5c5o0CfsObYYVwSgZaMvtfULdaJzLNOdJY-AJWMhio.jpg?auto=webp&s=72faf2456ea98753a15ed2938e233f6f1b05d323',
      altText: 'unknown Reddit meme',
      votes: 5,
      comments: [
        {
          author: 'Matthew',
          body: 'left side says "thinking about programming" and shows a little girl looking up dreamily, right side says "programming" and shows the girl crying',
          votes: 3
        }
      ]
    }
  ]
  const [posts, setPosts] = useState<Post[]>(tempPosts);

  const addPost = (post: Post) => {
    setPosts([...posts, post]);
    setCreatingPost(false);
  }
  return <MuiThemeProvider theme={theme}>
    {
      <div>
        <CreatePost addPost={addPost} isOpen={creatingPost} close={() => { setCreatingPost(false) }}></CreatePost>
        <VideoTranscribe isOpen={transcribingVideo} close={() => setTranscribingVideo(false)}></VideoTranscribe>
        <AzureAnalysis isOpen={azureAnalyzing} close={() => setAzureAnalyzing(false)}></AzureAnalysis>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => setCreatingPost(true)}>
          Create a new post
        </StyledButton>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => setAzureAnalyzing(true)}>
          Analyze image with AI
        </StyledButton>
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => setTranscribingVideo(true)}>
          Transcribe a video
        </StyledButton>
        <Posts posts={posts} />
      </div>
    }
  </MuiThemeProvider>

}

export default App;