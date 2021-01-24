import React, { ChangeEvent, useState } from 'react';
import './CreatePost.css';
import StyledButton from './StyledButton';
import Dialog from '@material-ui/core/Dialog';
import AzureCV from './AzureCV';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

type AzureAnalysisProps = {
  isOpen: boolean,
  close: () => void
}

const AzureAnalysis = (props: AzureAnalysisProps) => {
  const { isOpen, close } = props;
  const [fileURL, setFileURL] = useState("");
  const [doneAnalysis, setDoneAnalysis] = useState(false);
  const [gotError, setGotError] = useState(false);
  const [imageDescription, setImageDescription] = useState("");

  const onChangeFileURL = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = event.target.value;
    setFileURL(input);
  };

  const acceptedFileType = "image/*";

  const analyzeImage = async () => {
    const desc = await AzureCV.getDescription(fileURL)
      .catch((error) => { setGotError(true) });
    if (desc) {
      setImageDescription(desc);
      setDoneAnalysis(true);
    }
  }

  const clearAndClose = () => {
    setFileURL("");
    setDoneAnalysis(false);
    setGotError(false);
    setImageDescription("");
    close();
  }

  return (
    <Dialog open={isOpen} onClose={clearAndClose} maxWidth="lg" fullWidth={true} aria-labelledby="dialog-title">
      <div style={{ padding: 24 }}>
        <h1 id="dialog-title">Analyze image from URL with Azure AI</h1>
        <input
          className="input-box"
          value={fileURL}
          onChange={onChangeFileURL}
          placeholder="Input or paste image URL"
          accept={acceptedFileType}
          autoFocus={true}
        />
        {!gotError && fileURL && <img src={fileURL} alt="your input" />}
        <StyledButton
          variant="contained"
          color="primary"
          onClick={analyzeImage}>
          Analyze image
        </StyledButton>
        <StyledButton
          onClick={clearAndClose}>
          Cancel
      </StyledButton>
        {gotError && <p>Invalid image URL, please try again</p>}
        {doneAnalysis &&
          <div>
            <h2>Analysis results</h2>
            <p>{imageDescription}</p>
          </div>}

      </div>
    </Dialog>
  );
}

/*{
  uploadMethod === "File" &&
  <FileUpload setFile={onChangeFile} fileType={type}></FileUpload>
}*/

export default AzureAnalysis;