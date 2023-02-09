import React from 'react';

import './App.css';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState, useEffect, createRef } from 'react';
import axios from "axios";
import Select from 'react-select';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import { CRS, setOptions } from 'leaflet';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import Sly from 'sly-scroll';
import LUTSelector from './LUTSelector';
import Slider from './Slider';
import SliderMenu from './SliderMenu';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';

const DropdownIndicator = (
    props
) => {
    return (
        <div></div>
    );
};

function ImageRenderer(props) {
    const lutRef = createRef(null);
    const colorRef = createRef(null);
    const [genes, updateGenes] = useState(props.state.genes)
    const [organs, updateOrgans] = useState(props.state.organs)
    const [mice, updateMice] = useState(props.state.mice)
    const [slicesTomato, updateSlicesTomato] = useState(props.state.slicesTomato)
    const [slicesDAPI, updateSlicesDAPI] = useState(props.state.slicesDAPI)
    const [selectedSampleType, updateSelectedSampleType] = useState(props.state.selectedSampleType)
    const [selectedGene, updateSelectedGene] = useState(props.state.selectedGene)
    const [selectedOrgan, updateSelectedOrgan] = useState(props.state.selectedOrgan)
    const [selectedMouse, updateSelectedMouse] = useState(props.state.selectedMouse)
    const [selectedSlice, updateSelectedSlice] = useState(props.state.selectedMouse)
    const [selectedWavelength, updateselectedWavelength] = useState(props.state.selectedWavelength)
    const [colorAccordion, setColorAccordion] = useState(false);
    const [lutAccordion, setlutAccordion] = useState(false);
    const [slider, setSlider] = useState(null);
    const [loaded, setLoaded] = useState(null);

    const [options, updateOptions] = useState(props.state.options)

    const [lut, updateLut] = useState(props.state.lut)




    var $frame = $('#forcecentered ' + (props.main ? 1 : 2));
    var $wrap = $frame.parent();
    var slyOptions = {
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: true,
        activateMiddle: 1,

        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: props.state.selectedSlice,

        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,

        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,


    };




    function selectSlice(id) {


        updateSelectedSlice(id)
    }


    function preventDefault(e) {
        e = e || window.event
        if (e.preventDefault) {
            e.preventDefault()
        }
        e.returnValue = false
    }

    useEffect(() => {
        updateSelectedGene(null)
        updateSelectedOrgan(null)
        updateGenes([])
        updateOrgans([])
        if (selectedSampleType) {
            var url = "/filters?";
            url += "&instrument=" + selectedSampleType['value'];
            axios({
                method: "GET",
                url: url,
                dataType: "json",
                dataSrc: "items",
            }).then((response) => {
                var res = response.data.items

                res = Array.from(new Set(res = res.map(res => res.gene)))
                res.sort()
                updateGenes(res)

            })
        }
    }, [selectedSampleType])



    useEffect(() => {
        if (selectedGene) {
            updateSelectedOrgan(null)
            updateOrgans([])

            var url = "/filters?";
            url += "&instrument=" + selectedSampleType['value'];
            url += "&gene=" + selectedGene['value'];
            axios({
                method: "GET",
                url: url,
                dataType: "json",
                dataSrc: "items",
            }).then((response) => {
                var res = response.data.items

                res = Array.from(new Set(res = res.map(res => res.organ)))
                res.sort()
                updateOrgans(res)

            })
        }
    }, [selectedGene])



    useEffect(() => {
        if (slider) {
            slider.on('active', function (e, i) {
                selectSlice(i)
            });
            slider.reload()

        }
    }, [props.renderSize, slider, slicesTomato, slicesDAPI])

    useEffect(() => {

    }, [selectedSlice])



    useEffect(() => {
        loadSlices("DAPI")
        loadSlices("tdTomato")

    }, [selectedMouse])

    function loadSlices(wavelength) {
        if (selectedMouse) {
            var url = "/slices?per_page=-1&order_by=slice_id";
            url += "&instrument=" + selectedSampleType['value'];
            url += "&gene=" + selectedGene['value'];
            url += "&organ=" + selectedOrgan['value'];
            url += "&wavelength=" + wavelength;
            url += "&mouse_number=" + selectedMouse['value'];

            axios({
                method: "GET",
                url: url,
                dataType: "json",
                dataSrc: "items",
            }).then((response) => {
                var res = response.data.items




                wavelength === "DAPI" ? updateSlicesDAPI(res) : updateSlicesTomato(res)

                if (!slider) {
                    try {
                        setSlider(new Sly('#forcecentered' + (props.main ? 1 : 2), slyOptions).init())

                        slider.activate(props.state.selectedSlice)

                    } catch (e) {
                        console.log()
                    }
                }
                else {
                    slider.reload()
                    try {
                        slider.activate(props.state.selectedSlice)

                    } catch (e) {
                        console.log()
                    }
                }

            })
        }
    }

    useEffect(() => {
        updateSelectedMouse(null);
        updateMice([])
        if (selectedGene && selectedOrgan && selectedSampleType) {
            let url = "/mice?";

            url += "&instrument=" + selectedSampleType['value'];
            url += "&gene=" + selectedGene['value'];
            url += "&organ=" + selectedOrgan['value'];

            axios({
                method: "GET",
                url: url,
                dataType: "json",
                dataSrc: "items",
            }).then((response) => {
                var res = response.data.items

                updateMice(res)

            })
        }

    }, [selectedOrgan])

    function updateOption(key, value) {
        if (options[key] != value) {
            updateOptions({ ...options, [key]: value })
        }
    }

    function closeAccordions() {
        setColorAccordion(false);
        setlutAccordion(false);
    }

    // on click outside of the accordion, run closeAccordions()
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // if the click is outside of the accordion, close it
    function handleClickOutside(event) {

        // if classname is not lut-accordion or color-accordion, or if the event target does not contain a parent with the class lut-accordion or color-accordion, close the accordions
        if (!event.target.className.includes("accordion") && !event.target.closest(".accordion")) {
            closeAccordions()
        }





    }




    function togglelutAccordion() {
        setlutAccordion(!lutAccordion)

    }

    function toggleColorAccordion() {
        setColorAccordion(!colorAccordion)

    }

    function changeLut(layer, option) {
        if (lut[layer] != option) {
            updateLut({ ...lut, [layer]: option })

        }

    }


    function buildState() {
        return {
            genes: genes,
            organs: organs,
            mice: mice,
            slicesTomato: slicesTomato,
            slicesDAPI: slicesDAPI,
            selectedSampleType: selectedSampleType,
            selectedGene: selectedGene,
            selectedOrgan: selectedOrgan,
            selectedMouse: selectedMouse,
            selectedSlice: selectedSlice,
            selectedWavelength: selectedWavelength,
            loaded: loaded,
            options: options,
            lut: lut
        }
    }


    useEffect(() => {
        if (!props.main && !loaded) {
            loadSlices("DAPI")
            loadSlices("tdTomato")
            updateSelectedSlice(props.state.selectedSlice)

            setLoaded(true)
        }

    }, [selectedMouse])

    useEffect(() => {
        if (slider) {
            slider.reload()
            slider.activate(selectedSlice)
        }
    }, [selectedWavelength])

    function getSliceThumbnails() {
        return selectedWavelength === 'tdTomato' ? slicesTomato : slicesDAPI

    }
    function resetValues() {
        updateOptions({
            'brightness': 0,
            'contrast': 0,
            'min': 0,
            'max': 255,
            'blend': 100
        })
    }

    function getAutoValues() {
        var selectedUrl = "";
        if (selectedWavelength === "tdTomato") {
            selectedUrl = slicesTomato[selectedSlice] ? selectedUrl = slicesTomato[selectedSlice].img_no_ext : null
        }
        if (selectedWavelength === "DAPI") {
            selectedUrl = slicesDAPI[selectedSlice] ? slicesDAPI[selectedSlice].img_no_ext : null
        }


        axios({
            method: "GET",
            url: "http://localhost:5000/getAutoValues?url=" + encodeURIComponent(selectedUrl),
            dataType: "json",
            dataSrc: "items",
        }).then((response) => {
            var res = response.data
            updateOptions({
                brightness: parseInt(res.brightness),
                contrast: Math.round(parseFloat(res.contrast) / 3 * 100),
                min: res.min,
                max: res.max,
                blend: options.blend
            })
            console.log(options)


        })
    }

    return (
        <Container fluid className="imageBrowser">
            <Col>
                <Row className='justify-content-center'>
                    <Col lg={2}>
                        <div className='select-card'>
                            <label className="col-sm-12 col-form-label">Sample Type</label>
                            <Select
                                components={{ DropdownIndicator }}
                                defaultValue={selectedSampleType}
                                value={selectedSampleType}
                                isClearable={props.renderSize === 12 ? true : false} options={
                                    [
                                        { "value": "histological", "label": "Histological" },
                                        { "value": "cleared", "label": "Cleared" },
                                    ]
                                } onChange={(option) => updateSelectedSampleType(option ? option : null)} />

                            <label className="col-sm-4 col-form-label">Gene</label>

                            <Select
                                components={{ DropdownIndicator }}
                                defaultValue={selectedGene}
                                value={selectedGene}
                                isDisabled={genes.length === 0 || !selectedSampleType} isClearable={props.renderSize === 12 ? true : false} options={
                                    genes.map(gene => ({ "value": gene, "label": gene }))
                                } onChange={(option) => updateSelectedGene(option ? option : null)} />

                            <label className="col-sm-4 col-form-label">Organ</label>
                            <Select
                                components={{ DropdownIndicator }}
                                defaultValue={selectedOrgan}
                                value={selectedOrgan}
                                isDisabled={organs.length === 0} isClearable={props.renderSize === 12 ? true : false} options={
                                    organs.map(organ => ({ "value": organ, "label": organ }))
                                } onChange={(option) => updateSelectedOrgan(option ? option : null)} />

                            <label className="col-sm-4 col-form-label">Mouse</label>

                            <Select
                                components={{ DropdownIndicator }}
                                defaultValue={selectedMouse}
                                value={selectedMouse}
                                isDisabled={mice.length === 0 || !selectedOrgan} isClearable={props.renderSize === 12 ? true : false} options={

                                    mice.map(mouse => ({
                                        "value": mouse.number, "label": (mouse.sex !== true ? "♀" : "♂") + "  " + mouse.number + "  " +
                                            (mouse.spec === "+" ? "pos" : "neg")


                                    }))
                                } onChange={(option) => updateSelectedMouse(option ? option : null)} />

                            <br />


                            {props.main ? <button type="button" className="btn btn-toggle-split btn-dark" onClick={() => { props.splitScreen(buildState()) }}>Toggle Split Screen</button> : null}

                            <div className="col-sm-hidden col-md-10 row slice_details"></div>
                        </div>
                        {selectedMouse ?

                            <div className='select-card'>
                                <b>Experiment</b>
                                <br></br>
                                <br></br>
                                Mouse Id: {selectedMouse ? selectedMouse.value : null}

                                <br></br>
                                Age: {slicesTomato[selectedSlice] ? slicesTomato[selectedSlice].age : null}
                                <br></br>
                                Sex: {slicesTomato[selectedSlice] ? slicesTomato[selectedSlice].sex : null}

                            </div>
                            : null}


                    </Col>




                    <Col lg={10} style={{
                        height: '550px'
                    }} >

                        <MapContainer
                            fullscreenControl={true}
                            center={[-50, -50]} maxBoundsViscosity={1.0} nowrap={true} scrollWheelZoom zoom={2} >

                            <SliderMenu position="bottomleft" active={colorAccordion} closeAccordions={closeAccordions} toggleAccordion={toggleColorAccordion}
                                logo={"Color Options"}
                                className="color-accordion"
                            >

                                <Slider label="min" value='min' updateOption={updateOption} defaultValue={options['min']} onChange={() => console.log()} tooltip='Adjust Min Value' min={0} max={255} delta={10} />
                                <Slider label="max" value='max' updateOption={updateOption} defaultValue={options['max']} onChange={() => console.log()} tooltip='Adjust Max Value' min={0} max={255} delta={10} />
                                <Slider icon='tint' value='blend' updateOption={updateOption} defaultValue={options['blend']} onChange={() => console.log()} tooltip='Adjust Opacity' min={0} max={100} delta={15} />
                                <Slider icon='sun' value='brightness' updateOption={updateOption} defaultValue={options['brightness']} onChange={() => console.log()} tooltip='Adjust Brightness' min={-255} max={255} delta={10} />
                                <Slider icon='adjust' value='contrast' updateOption={updateOption} defaultValue={options['contrast']} onChange={() => console.log()} tooltip='Adjust Contrast' min={-255} max={255} delta={10} />
                                <br></br>
                                <Button size='sm' onClick={() => resetValues()}> Reset Values</Button>
                                &nbsp;
                                <Button size='sm' onClick={() => getAutoValues()}> Auto</Button>
                            </SliderMenu>
                            <SliderMenu position="bottomright" closeAccordions={closeAccordions} active={lutAccordion} toggleAccordion={togglelutAccordion}
                                className="lut-accordion"
                                description={''}
                                logo={"LUT"}
                            >
                                <LUTSelector layer={'tdTomato'} changeLut={changeLut} option={lut['tdTomato']} />

                                <LUTSelector layer={'DAPI'} changeLut={changeLut} option={lut['DAPI']} />
                            </SliderMenu>

                            <LayersControl position="topright">

                                <LayersControl.Overlay checked name="tdTomato">
                                    <TileLayer
                                        opacity={options.blend / 100}
                                        tms={true}
                                        minZoom={2}
                                        maxZoom={7}
                                        noWrap={true}

                                        crs={CRS.Simple}
                                        bounds={[[-150, -150], [500, 180]]}

                                        url={"http://localhost:5000/lut" + '/{z}/{x}/{y}.png' + "?lut=" + lut['tdTomato'] + "&url=" + encodeURIComponent(slicesTomato[selectedSlice] ? slicesTomato[selectedSlice].img_no_ext : null) + "&brightness=" + options.brightness +
                                            "&contrast=" + options.contrast +
                                            "&cliplow=" + options.min +
                                            "&cliphigh=" + options.max}
                                    />
                                </LayersControl.Overlay>
                                <LayersControl.Overlay name="DAPI">
                                    <TileLayer
                                        opacity={options.blend / 100}
                                        tms={true}
                                        minZoom={2}
                                        maxZoom={7}
                                        noWrap={true}

                                        crs={CRS.Simple}
                                        bounds={[[-150, -150], [500, 180]]}

                                        url={"http://localhost:5000/lut" + '/{z}/{x}/{y}.png' + "?lut=" + lut['DAPI'] + "&url=" + encodeURIComponent(slicesDAPI[selectedSlice] ? slicesDAPI[selectedSlice].img_no_ext : null) + "&brightness=" + options.brightness +
                                            "&contrast=" + options.contrast +
                                            "&cliplow=" + options.min +
                                            "&cliphigh=" + options.max}
                                    />
                                </LayersControl.Overlay>
                            </LayersControl>

                        </MapContainer>



                        <div className="wrap">
                            <Row>
                                <Col lg={1}>
                                    <div className="controls center" >
                                        <ButtonGroup aria-label="Basic example">
                                            <Button variant="danger"
                                                disabled={selectedWavelength === "tdTomato"}
                                                onClick={() => updateselectedWavelength("tdTomato")}
                                            >tdTomato</Button>
                                            <Button variant="info"
                                                disabled={selectedWavelength === "DAPI"}
                                                onClick={() => updateselectedWavelength("DAPI")}
                                            >DAPI</Button>
                                        </ButtonGroup>
                                    </div>
                                </Col>
                                <Col lg={11}>

                                    <div className="controls center" >
                                        <Button onClick={() => slider.prev()}>
                                            <i className="fa fa-arrow-left"></i>
                                        </Button>
                                        &nbsp;
                                        &nbsp;
                                        <span className="" style={{ fontWeight: 'bold', color: '#0aaaf1', fontSize: 'larger' }}>

                                            Slice <input className="current_id" type="number" min="0" style={{ width: '50px' }}
                                                value={selectedSlice === 0 ? 1 : selectedSlice + 1} onChange={() => console.log()} />
                                            &nbsp; of <span className="total_result">{slicesTomato.length}</span>
                                        </span>
                                        &nbsp;
                                        &nbsp;
                                        <Button onClick={() => slider.next()}>
                                            <i className="fa fa-arrow-right"></i>
                                        </Button>

                                    </div>
                                </Col>
                            </Row>


                            <div className="frame" id={"forcecentered" + (props.main ? 1 : 2)}>
                                <ul className="clearfix">

                                    {
                                        getSliceThumbnails().map((slice, index) => {
                                            return <li key={index} id={"_" + index} index={index}
                                                //onclick, slide to slice and update selected slice
                                                onClick={() => {
                                                    slider.activate(index)

                                                }}  >
                                                <img src={slice + ".webp"} className="slice" />
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>

                        </div>

                    </Col>
                </Row>
            </Col >
        </Container >
    );
}

export default ImageRenderer;
