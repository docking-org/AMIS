import React, { Component } from "react";
import { useMap } from "react-leaflet";
import L, { LeafletMouseEvent, Map } from "leaflet";
import { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import * as ReactDOM from 'react-dom';
import Form from 'react-bootstrap/Form';
const options = [
    { value: 'grayscale', label: 'Grayscale' },
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'inverted', label: 'Inverted' }
];

function LUTSelector(props) {
    const [selectedOption, setSelectedOption] = useState(null);



    return (
        <div style={{ display: "flex", width: "200px", padding: '5px' }}>
            <label className="col-sm-4 col-form-label">{props.layer}</label>
            <Form.Select aria-label="Default select example" defaultValue={props.option} onChange={(e) => {
                props.changeLut(props.layer, e.target.value)

            }}  >
                {options.map((option) => {
                    return <option value={option.value} key={option.value} onChange={() => console.log()}>
                        {option.label}
                    </option>
                })}
            </Form.Select>

        </div>
    )
}


export default LUTSelector;