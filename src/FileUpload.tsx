import Dropzone from 'react-dropzone-uploader';
import React from 'react';
import { FileType } from './Post';
import './FileUpload.css';
import AzureCV from './AzureCV';

//source: https://react-dropzone-uploader.js.org/docs/examples

type FileUploadProps = {
  setFile: (url: string) => void,
  fileType: FileType
}

const FileUpload = (props: FileUploadProps) => {
  const { setFile, fileType } = props;

  const handleChangeStatus = ({ meta }: any, status: string) => {
    console.log(status);
    console.log(meta);
    if (status === 'done') {
      setFile(meta.previewUrl);
    }
  }

  const handleSubmit = async (files: any[], allFiles: any[]) => {
    const fileURL = URL.createObjectURL(files[0].file);
    await AzureCV.analyzeImage(fileURL);
  }

  const acceptedFileType = fileType.toLowerCase() + "/*";
  return (
    <Dropzone
      onChangeStatus={handleChangeStatus}
      maxFiles={1}
      multiple={false}
      accept={acceptedFileType}
      onSubmit={handleSubmit}
      canCancel={false}
      inputContent={(files, extra) => (extra.reject ? 'Invalid file type' : 'Select a file:')}
      styles={{
        dropzoneReject: { borderColor: 'red', backgroundColor: '#DAA' },
        inputLabel: (files, extra) => (extra.reject ? { color: 'red' } : {}),
      }}
    />
  )
}

export default FileUpload;