import React from 'react';
import './App.css';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';

import ImageRenderer from './ImageRenderer';

function ImageBrowser() {
    const [renderSize, updateSize] = useState(12)
    const [update, setUpdate] = useState(null)
    const [clone, setClone] = useState(false)
    const [state, setState] = useState({
        sampleTypes: [],
        genes: [],
        organs: [],
        mice: [],
        slicesTomato: [],
        slicesDAPI: [],
        slices: {},
        selectedSampleType: null,
        selectedGene: null,
        selectedOrgan: null,
        selectedMouse: null,
        selectedSlice: 1,
        selections: [],
        optionsLoaded: false,
        selectedWavelength: "tdTomato",
        colorAccordion: false,
        options: {
            'brightness': 0,
            'contrast': 0,
            'min': 0,
            'max': 255,
            'blend': 100
        },
        lut:
        {
            'tdTomato': 'grayscale',
            'DAPI': 'grayscale',
            'GFP': 'grayscale',
        }

    }
    );



    function splitScreen(newState) {
        setState(newState)
        if (renderSize === 12) {
            setClone(true)
            updateSize(6)
        } else {
            setClone(false)
            updateSize(12)
        }
    }


    useEffect(() => {
        //leaflet doesn't like changing the col size. Force a window resize to trigger map update
        global.dispatchEvent(new Event('resize'));

    }, [renderSize])


    return (
        <Container fluid className="imageBrowser">
            <Row>
                <Col lg={renderSize}>
                    <ImageRenderer splitScreen={splitScreen} main={true} renderSize={renderSize} state={state} />
                </Col>
                <Col hidden={renderSize === 12} lg={renderSize}>
                    {clone ? <ImageRenderer splitScreen={splitScreen} main={false} renderSize={renderSize} state={state} /> : null}
                </Col>
            </Row>
        </Container>
    );
}

export default ImageBrowser;
