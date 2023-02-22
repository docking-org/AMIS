import React, { Component } from "react";
import { useMap } from "react-leaflet";
import L, { LeafletMouseEvent, Map } from "leaflet";
import { useState, useEffect, useRef, useCallback, useContext } from 'react';

import { createRoot } from 'react-dom/client';


function OpenPopup(props) {
  

    function createMenu() {

        const Menu = L.Control.extend({
            onAdd: function (map) {

                const container = L.DomUtil.create('div', '');


                var popup = (
                   
                    <i className="fas fa-window-maximize" style={{ fontSize: '1.5em', color: 'white', cursor: 'pointer' }} onClick={() => {
                        props.setWindowOpen(true);
                       
                    }}></i>
                );

                const root = createRoot(container);
                root.render(popup);

                return container;
            }
        });
        return new Menu({ position: props.position });
    }
    useEffect(() => {
        const menu = createMenu();

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

export default withMap(OpenPopup);
