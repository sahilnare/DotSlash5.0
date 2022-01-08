import React, { useRef, useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
mapboxgl.accessToken = "pk.eyJ1Ijoic2FoaWxuYXJlNzgiLCJhIjoiY2t5MDdndHEwMDBlczJxb2FvMmtoemR3ZiJ9.oyPoHxer2FC8Kr5P2f6BSg";

export const Maps = (props) => {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(72.87);
    const [lat, setLat] = useState(19.07);
    const [zoom, setZoom] = useState(9);
    const [inpLng, setInpLng] = useState('');
    const [inpLat, setInpLat] = useState('');

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: zoom,
        });
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true,
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
            })
        );
    });

    const moveMap = (lat, lng) => {
        map.current.flyTo({
            center: [lat, lng],
            essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        });
    };

    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on("move", () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    return (
        <div>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
            <InputText type="text" value={inpLat} onChange={(e) => setInpLat(e.target.value)} placeholder="Lat"></InputText>
            <InputText type="text" value={inpLng} onChange={(e) => setInpLng(e.target.value)} placeholder="Lng"></InputText>
            <Button
                label="Submit"
                onClick={(e) => {
                    e.preventDefault();
                    setLat(inpLat);
                    setLng(inpLng);
                    moveMap(inpLng, inpLat);
                }}
                className="mr-2 mb-2"
            ></Button>
        </div>
    );
};
