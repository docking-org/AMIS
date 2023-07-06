import React, { Component } from "react";
import { useMap } from "react-leaflet";
import L, { LeafletMouseEvent, Map } from "leaflet";
import { useState, useEffect, useRef, useCallback } from 'react';
import Select from 'react-select';
import * as ReactDOM from 'react-dom';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';

function Slider(props) {
    const map = props.map;
    const [sliderValue, setSliderValue] = useState(props.defaultValue);
    const [tooltip, setTooltip] = useState(<Tooltip id="button-tooltip" {...props}>
        {props.tooltip}
    </Tooltip>)
    function preventDefault(e) {
        e = e || window.event
        if (e.preventDefault) {
            e.preventDefault()
        }
        e.returnValue = false
    }



    useEffect(() => {

        return () => {
            setTooltip(null)
        }
    })

    return (
        <div className="slider">
            <label htmlFor={props.value}>{props.label}<i className={`fas fa-${props.icon}`}
            ></i></label>
            &nbsp;
            &nbsp;
            <Tooltip anchorId={props.value} place="top" />
            <input type="range" min={props.min} max={props.max} defaultValue={props.defaultValue} className="slider" id={props.value} onChange={(e) => props.updateOption(props.value, e.target.value)}
                data-tooltip-content={props.tooltip}

                onWheel={(e) => {
                    e.target.value = parseInt(e.target.value) + e.deltaY / props.delta;
                    props.updateOption(props.value, e.target.value);
                    setSliderValue(e.target.value);
                }}

            />


            &nbsp;
            <span className="slider-value"
                style={{
                    width: "40px", display: "inline-block", textAlign: "center", fontSize: "12 px", whiteSpace: "nowrap"
                }}
            > {
                    Math.round(65535 * (sliderValue - props.min) / (props.max - props.min))
                }</span>
        </div >

    )
}



export default Slider;
