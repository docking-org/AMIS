import React from "react";
import ReactPlayer from "react-player";
import { VideoSeekSlider } from "react-video-seek-slider";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  Row,
} from "react-bootstrap";
import { useRef, useState, useEffect, useCallback } from "react";
import "react-video-seek-slider/styles.css";
import FormRange from "react-bootstrap/esm/FormRange";
export default function Browser3d(props) {
  const player = useRef(null);
  const previewImage = useRef("");
  const interval = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState("");

  const handlePlay = () => {
    //if at end of video, reset to beginning
    if (currentFrame === totalFrames) {
      player.current.currentTime = 0;
    }
    player?.current?.play();

    interval.current = setInterval(() => {
      setCurrentFrame(Math.floor(player.current.currentTime * 30));
      setCurrentTime(player.current.currentTime);
    }, 33);
  };

  const handlePause = () => {
    player?.current?.pause();
    clearInterval(interval.current);
    interval.current = null;
  };

  const onSliderChange = useCallback(
    (value) => {
      console.log(value);
      // if (interval.current) {
      //   handlePause();
      // }
      setCurrentFrame(value);
      setCurrentTime(value / 30);
      player.current.currentTime = value / 30;
    },
    [interval]
  );

  useEffect(() => {
    setTotalFrames(Math.floor(player.current.duration * 30));
    setCurrentFrame(Math.floor(player.current.currentTime * 30));
    setCurrentTime(player.current.currentTime);
  }, [player, selectedVideo]);

  const handleProgress = () => {
    setCurrentFrame(Math.floor(player.current.currentTime * 30));
    setCurrentTime(player.current.currentTime);
  };

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = () => {
    fetch("/getVideos")
      .then((res) => res.json())
      .then((data) => {
        setVideos(data.videos);
      });
  };
  return (
    <Container fluid className="imageBrowser">
      <Row className="mt-3">
        <Col md={3}>
          <Card>
            <Card.Body>
              <Card.Title>3D Browser</Card.Title>
              <Form>
                <Form.Select
                  aria-label="Default select example"
                  onChange={(e) => {
                    setSelectedVideo(e.target.value);
                    console.log(selectedVideo);
                  }}
                >
                  <option value="" disabled selected>
                    Select Video
                  </option>
                  {videos.map((video) => (
                    <option key={video} value={video}>
                      {video}
                    </option>
                  ))}
                </Form.Select>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={9}>
          <video
            ref={player}
            id="video"
            width="100%"
            height="75%"
            onClick={() => {
              if (interval.current) {
                handlePause();
              } else {
                handlePlay();
              }
            }}
            onTimeUpdate={handleProgress}
            onLoadedData={() =>
              setTotalFrames(Math.floor(player.current.duration * 30))
            }
            key={selectedVideo}
          >
            <source
              src={
                "https://files.docking.org/idg-images/vid/" +
                selectedVideo +
                ".mp4"
              }
              type="video/mp4"
            />
          </video>
          <FormRange
            value={currentFrame}
            min={0}
            max={totalFrames}
            step={1}
            onChange={(e) => onSliderChange(e.target.value)}
          ></FormRange>
          <br></br>
          <div>
            <Button
              onClick={() => {
                if (interval.current) {
                  handlePause();
                } else {
                  handlePlay();
                }
              }}
            >
              <i className="fas fa-play"></i>
            </Button>
            &nbsp;&nbsp;
            <Button disabled>
              <span>{currentFrame + "/" + totalFrames} frames</span>
            </Button>
            &nbsp;&nbsp; &nbsp;&nbsp;
            <ButtonGroup>
              <Button
                onClick={() => {
                  if (player.current && player.current.playbackRate > 0.5) {
                    player.current.playbackRate -= 0.5;
                  }
                }}
              >
                <span>
                  <i className="fas fa-backward"></i>
                </span>
              </Button>
              <Button
                onClick={() => {
                  if (player.current && player.current.playbackRate < 8)
                    player.current.playbackRate += 0.5;
                }}
              >
                <span>
                  <i className="fas fa-forward"></i>
                </span>
              </Button>
              <Button disabled>
                <span>
                  {player.current && player.current.playbackRate}x speed
                </span>
              </Button>
            </ButtonGroup>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
