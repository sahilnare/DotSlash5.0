import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from "primereact/button";
import { WeatherService } from '../service/WeatherService';
import { CropService } from '../service/CropService';
import { Messages } from 'primereact/messages';

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

export const Crops = () => {

    const [checkboxValue, setCheckboxValue] = useState([]);
    const [nitrogen, setNitrogen] = useState('');
    const [potassium, setPotassium] = useState('');
    const [phosphorus, setPhosphorus] = useState('');
    const [phlevel, setPhlevel] = useState('');
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [rainfall, setRainfall] = useState('');
    const [recommendCrop, setRecommendCrop] = useState('');

    const cropDisplayMessage = useRef();

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

                    weatherService.getCurrentWeather(locationData).then((data) => {
                        console.log(data);
                        setHumidity(data.current.humidity);
                        setTemperature(data.current.temp);
                    });
            
                    weatherService.getCurrentRainfall(locationData).then((data) => {
                        console.log(data);
                        setRainfall(data.data[0].precip);
                        // setTemperature(data.current.temp);
                    });

                }, failureCallback);

        }
        
    }, []);


    const onSubmitCropData = () => {
        const cropData = {
            "N" : Number(nitrogen), "P" : Number(phosphorus), "K" : Number(potassium), 
            "temperature" : Number(temperature), "humidity" : Number(humidity), "ph": Number(phlevel), "rainfall" : Number(rainfall)
        };

        const cropService = new CropService();
        cropService.getCrop(cropData).then((cropRec) => {
            console.log(cropRec);
            cropDisplayMessage.current.show({ severity: 'success', content: `${toTitleCase(cropRec)} is the best crop for your conditions.`, life: 240000 });
        });
    }


    return (
        <div className="grid p-fluid">
            
            <div className="col-12">
                <div className="card">
                    <h4>Crop Selection</h4>
                    <div className="grid p-fluid pt-4">
                        <div className="col-12 md:col-6">
                            <h5>Nitrogen</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <InputText placeholder="Nitrogen" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)}/>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Phosphorus</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <InputText placeholder="Phosphorus" value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)}/>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Potassium</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <InputText placeholder="Potassium" value={potassium} onChange={(e) => setPotassium(e.target.value)}/>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>PH Level</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-star"></i>
                                </span>
                                <InputText placeholder="PH Level" value={phlevel} onChange={(e) => setPhlevel(e.target.value)}/>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Temperature</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-sun"></i>
                                </span>
                                <InputText placeholder="Temperature" value={temperature} onChange={(e) => setTemperature(e.target.value)}/>
                            </div>
                        </div>

                        <div className="col-12 md:col-6">
                            <h5>Humidity</h5>
                            <div className="p-inputgroup">
                                <span className="p-inputgroup-addon">
                                    <i className="pi pi-globe"></i>
                                </span>
                                <InputText placeholder="Humidity" value={humidity} onChange={(e) => setHumidity(e.target.value)}/>
                            </div>
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
                    <Messages ref={cropDisplayMessage} />
                </div>
            </div>
        </div >
    )
}
