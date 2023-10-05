import React from "react";
import ReactPlayer from "react-player";
import { VideoSeekSlider } from "react-video-seek-slider";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useRef, useState, useEffect, useCallback } from "react";
import "react-video-seek-slider/styles.css"
import FormRange from "react-bootstrap/esm/FormRange";
export default function Browser3d(props) {
    const player = useRef(null);
    const previewImage = useRef("");
    const interval = useRef(null);
    const [currentFrame, setCurrentFrame] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [totalFrames, setTotalFrames] = useState(0);


    const handlePlay = () => {
        player?.current?.play();
        interval.current = setInterval(() => {
            setCurrentFrame(Math.floor(player.current.currentTime * 30));
            setCurrentTime(player.current.currentTime);
        }
            , 33);

    };

    const handlePause = () => {
        player?.current?.pause();
        clearInterval(interval.current);
        interval.current = null;
    };

    const onSliderChange = useCallback(
        (value) => {
            console.log(value);
            if (interval.current) {
                handlePause();
            }
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
    }, [player]);


    return (
        <Container fluid className="imageBrowser">
            <Row>
                <Col md={3}>

                </Col>
                <Col md={9}>

                    <video
                        ref={player}
                        id="video"
                        width="100%"
                        height="100%"

                    // onTimeUpdate={handleProgress}
                    >
                        <source src="https://files.docking.org/idg-images/video_L1-M1-TAM_12-27-22.mp4" type="video/mp4" />
                    </video>
                    <FormRange
                        value={currentFrame}
                        min={0}
                        max={totalFrames}
                        step={1}
                        onChange={(e) => onSliderChange(e.target.value)}
                    >
                    </FormRange>
                    <br></br>
                    <div>
                        <Button
                            onClick={() => {
                                if (interval.current) {
                                    handlePause();
                                }
                                else {

                                    handlePlay();
                                }
                            }
                            }
                        >
                            <i className="fas fa-play"></i>


                        </Button>

                        &nbsp;&nbsp;
                        <Button disabled>
                            <span>{currentFrame + "/" + totalFrames} frames</span>
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container >
    )
}
