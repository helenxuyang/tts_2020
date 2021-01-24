import React, { ChangeEvent, useState } from 'react';
import ReactPlayer from 'react-player';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import StyledButton from './StyledButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';

type VideoTranscribeProps = {
  isOpen: boolean,
  close: () => void
}

type Caption = {
  start: string,
  end: string,
  line: string
}

const VideoTranscribe = (props: VideoTranscribeProps) => {
  const { isOpen, close } = props;
  const [url, setURL] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [transcript, setTranscript] = useState<Caption[]>([]);
  const [done, setDone] = useState(false);

  const onChangeURL = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const input = event.target.value;
    setURL(input);
  };

  const pad = (num: number) => {
    return ('0' + num).slice(-2)
  }

  const formatTime = (seconds: number) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    return `${pad(hh)}:${pad(mm)}:${ss}`;
  }

  const formattedTimeToSeconds = (input: string) => {
    const firstColonIndex = input.indexOf(':');
    const secondColonIndex = input.lastIndexOf(':');
    const hoursInput = input.substring(0, firstColonIndex);
    const minutesInput = input.substring(firstColonIndex + 1, secondColonIndex);
    const secondsInput = input.substring(secondColonIndex + 1);
    const hours = parseInt(hoursInput);
    const minutes = parseInt(minutesInput);
    const seconds = parseInt(secondsInput);
    return (hours * 3600 + minutes * 60 + seconds);
  }

  const addCaption = () => {
    const latest = transcript.length > 0 ? formattedTimeToSeconds(transcript[transcript.length - 1].end) : seconds;
    const caption: Caption = {
      start: formatTime(Math.max(seconds, latest)),
      end: formatTime(Math.max(seconds, latest) + 3),
      line: ""
    }
    setTranscript([...transcript, caption]);
  }

  const validateTime = (input: string, captionIndex: number, isStart: boolean): boolean => {
    const firstColonIndex = input.indexOf(':');
    const secondColonIndex = input.lastIndexOf(':');
    const hoursInput = input.substring(0, firstColonIndex);
    const minutesInput = input.substring(firstColonIndex + 1, secondColonIndex);
    const secondsInput = input.substring(secondColonIndex + 1);
    const validFormat = (hoursInput.length === 2 && minutesInput.length === 2 && secondsInput.length === 2)
    if (!validFormat) {
      return false;
    }
    const hours = parseInt(hoursInput);
    const minutes = parseInt(minutesInput);
    const seconds = parseInt(secondsInput);
    const validNumbers = (!Number.isNaN(hours) && !Number.isNaN(minutes) && !Number.isNaN(seconds));
    if (!validNumbers) {
      return false;
    }
    if (isStart) {
      if (formattedTimeToSeconds(transcript[captionIndex].end) < formattedTimeToSeconds(input)) {
        return false;
      }
      if (captionIndex > 0 && formattedTimeToSeconds(transcript[captionIndex - 1].end) > formattedTimeToSeconds(input)) {
        return false;
      }
    }
    else {
      if (formattedTimeToSeconds(transcript[captionIndex].start) > formattedTimeToSeconds(input)) {
        return false;
      }
      if (captionIndex < transcript.length - 1 && formattedTimeToSeconds(transcript[captionIndex + 1].start) < formattedTimeToSeconds(input)) {
        return false;
      }
    }
    return true;
  }

  const clearAndClose = () => {
    setURL("");
    setSeconds(0);
    setTranscript([]);
    setDone(false);
    close();
  }

  const ref = React.useRef<ReactPlayer>(null);

  return (
    <Dialog open={isOpen} onClose={clearAndClose} maxWidth="lg" fullWidth={true} aria-labelledby="dialog-title">
      <div style={{ padding: 24 }}>
        <h1 id="dialog-title">Transcribe a video</h1>
        <input
          className="input-box"
          value={url}
          onChange={onChangeURL}
          placeholder="Input or paste video URL"
        />
        {url && < ReactPlayer
          ref={ref}
          url={url}
          controls
          onProgress={(state) => { setSeconds(state.playedSeconds) }}
        />}
        {url && <Table>
          <TableHead>
            <TableRow>
              <TableCell>Start time (hh:mm:ss)</TableCell>
              <TableCell>End time (hh:mm:ss)</TableCell>
              <TableCell>Caption</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              transcript.map((caption, index) =>
                <TableRow key={index}>
                  <TableCell>
                    <TextField value={caption.start} error={!validateTime(caption.start, index, true)}
                      onChange={(event) => {
                        const newStart = event.target.value;
                        const transcriptCopy = [...transcript];
                        const captionCopy = { ...transcriptCopy[index] };
                        captionCopy.start = newStart;
                        transcriptCopy[index] = captionCopy;
                        setTranscript(transcriptCopy);
                      }} />
                  </TableCell>
                  <TableCell>
                    <TextField value={caption.end} error={!validateTime(caption.end, index, false)}
                      onChange={(event) => {
                        const newEnd = event.target.value;
                        const transcriptCopy = [...transcript];
                        const captionCopy = { ...transcriptCopy[index] };
                        captionCopy.end = newEnd;
                        transcriptCopy[index] = captionCopy;
                        setTranscript(transcriptCopy);
                      }} />
                  </TableCell>
                  <TableCell>
                    <TextField value={caption.line}
                      onChange={(event) => {
                        const newLine = event.target.value;
                        const transcriptCopy = [...transcript];
                        const captionCopy = { ...transcriptCopy[index] };
                        captionCopy.line = newLine;
                        transcriptCopy[index] = captionCopy;
                        setTranscript(transcriptCopy);
                      }}
                      onKeyUp={(event) => {
                        if (event.key === "Enter") {
                          if (index === transcript.length - 1) {
                            addCaption();
                          }
                          else {

                          }
                        }
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
        }
        {url && <StyledButton
          variant="contained"
          color="primary"
          onClick={addCaption}>
          Add caption
        </StyledButton>
        }
        <StyledButton
          variant="contained"
          color="primary"
          onClick={() => { setDone(true) }}>
          Generate transcript
        </StyledButton>
        {done &&
          <div>
            <h2>Transcript</h2>
            {transcript.map((caption) => <p>{`${caption.start}-${caption.end} ${caption.line}`}</p>)}
          </div>}
        <StyledButton
          onClick={clearAndClose}>
          Close
        </StyledButton>
      </div>
    </Dialog>
  );
}

export default VideoTranscribe;