import React, { Component } from "react";
import { useMap } from "react-leaflet";
import L, { LeafletMouseEvent, Map } from "leaflet";
import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { createRoot } from 'react-dom/client';
function SliceToggle(props) {
    function createSliceMenu() {
        const Slices = L.Control.extend({
            onAdd: function (map) {

                const container = L.DomUtil.create('div', '');


                var accordion = (


                    <div>
                        {props.children}
                    </div>


                );
                const root = createRoot(container);
                root.render(accordion);
                return container;
            }
        });
        return new Slices({ position: props.position });
    }
    useEffect(() => {
        const menu = createSliceMenu();

        menu.addTo(props.map);
        return function cleanup() {
            props.map.removeControl(menu);
        }
    });
}

function withMap(Component) {
    return function WrappedComponent(props) {
        const map = useMap();
        return <Component {...props} map={map} />;
    }
}

export default withMap(SliceToggle);
