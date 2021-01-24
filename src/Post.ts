import React from 'react';

export type FileType = "Image" | "Audio" | "Video";

export type Post = {
  type: FileType,
  author: string,
  title: string,
  body: string,
  fileURL: string,
  altText?: string,
  comments: Comment[],
  votes: number
}

export type Comment = {
  author: string,
  body: string,
  votes: number
}