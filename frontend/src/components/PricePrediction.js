import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { WeatherService } from '../service/WeatherService';
import { CropService } from '../service/CropService';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Messages } from 'primereact/messages';


export const PricePrediction = () => {

    // const [checkboxValue, setCheckboxValue] = useState([]);
    const [rainfall, setRainfall] = useState('');
    const [recommendCrop, setRecommendCrop] = useState('');
    const [dropdownValue, setDropdownValue] = useState(null);
    const [calendarValue, setCalendarValue] = useState(null);

    const priceDisplayMessage = useRef();

    const dropdownValues = [
        { name: 'Cotton'},
        { name: 'Coconut'},
        { name: 'Wheat'},
        { name: 'Maize'},
        { name: 'Jute'},
        { name: 'Moong'},
        { name: 'Black_Gram'}
    ];

    const failureCallback = (callback) => {
        console.log(callback);
    }

    useEffect(() => {
        const weatherService = new WeatherService();

        if (window.navigator.geolocation) {
            // Geolocation available
            window.navigator.geolocation
                .getCurrentPosition((geoLocation) => {
                    console.log(geoLocation.coords.latitude);
                    console.log(geoLocation.coords.longitude);
                    const locationData = {
                        lat: geoLocation.coords.latitude,
                        lon: geoLocation.coords.longitude
                    };
            
                    weatherService.getCurrentRainfall(locationData).then((data) => {
                        console.log(data);
                        setRainfall(data.data[0].precip);
                        // setTemperature(data.current.temp);
                    });

                }, failureCallback);

        }
        
    }, []);


    const onSubmitCropData = () => {
        // const cropData = {
        //     crop : "maize", month : 7, year : 2020, rainfall : 202.935536
        // };

        let cropDropdown = dropdownValue.name.toLowerCase();
        let year = calendarValue.getFullYear();
        let month = calendarValue.getMonth() + 1;

        const cropData = {crop: cropDropdown, month: month, year: year, rainfall: rainfall}

        const cropService = new CropService();
        cropService.pricePrediction(cropData).then((cropRec) => {
            console.log(cropRec);
            priceDisplayMessage.current.show({ severity: 'success', summary: `Rs ${cropRec} per quintal is the price for your crop.`, life: 300000 });
        });
    }


    return (
        <div className="grid p-fluid">
            
            <div className="col-12">
                <div className="card">
                    <h4>Crop Selection</h4>
                    <div className="grid p-fluid pt-4">

                        <div className="col-12 md:col-6">
                            <h5>Select the crop</h5>
                            <Dropdown value={dropdownValue} onChange={(e) => setDropdownValue(e.value)} options={dropdownValues} optionLabel="name" placeholder="New Crop" />
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Rainfall</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-cloud"></i>
                                </span>
                                <InputText placeholder="Rainfall" value={rainfall} onChange={(e) => setRainfall(e.target.value)}/>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Date</h5>
                            <Calendar showIcon showButtonBar value={calendarValue} onChange={(e) => setCalendarValue(e.value)}></Calendar>
                        </div>

                    </div>
                    <div className="col-6 md:col-6 pt-4">
                        <Button
                            label="Submit Data"
                            onClick={(e) => {
                                e.preventDefault();
                                onSubmitCropData();
                            }}
                            className="mr-2 mb-2"
                        ></Button>
                    </div>
                    <Messages ref={priceDisplayMessage} />
                </div>
            </div>
        </div >
    )
}
