import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Button } from "primereact/button";
import { WeatherService } from '../service/WeatherService';
import { Skeleton } from 'primereact/skeleton';

export const WeatherAPI = () => {

    const [tempChartSelected, setTempChartSelected] = useState('this_week');

    const [tempChartMin, setTempChartMin] = useState([]);
    const [tempChartMax, setTempChartMax] = useState([]);
    const [tempChartToday, setTempChartToday] = useState([]);
    const [tempChartLabels, setTempChartLabels] = useState([]);
    const [tempChartTodayLabels, setTempChartTodayLabels] = useState([]);
    const [humidityChart, setHumidityChart] = useState([]);
    const [humidityChartLabels, setHumidityChartLabels] = useState([]);
    const [rainfallChart, setRainfallChart] = useState([]);
    const [rainfallChartLabels, setRainfallChartLabels] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const weatherService = new WeatherService();
        const newTempChartLabels = [];
        const newTempChartMin = [];
        const newTempChartMax = [];
        const newTempChartToday = [];
        const newTempChartTodayLabels = [];
        const newHumidityChart = [];
        const newRainfallChart = [];
        const newRainfallLabels = [];

        const failureCallback = (callback) => {
            console.log(callback);
        }

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

                    weatherService.getWeather(locationData).then((data) => {
                        console.log(data);
                        setIsLoaded(true);
            
                        data.daily.forEach(day => {
            
                            const dateObject = new Date(day.dt * 1000);
                            const weekday = dateObject.toLocaleString("en-US", {weekday: "long"});
                            // const numericDate = dateObject.toLocaleString("en-US", {day: "numeric"});
            
                            newTempChartMin.push(day.temp.min);
                            newTempChartMax.push(day.temp.max);
                            newTempChartLabels.push(weekday);
                            newHumidityChart.push(day.humidity);
                        });
            
                        data.hourly.forEach(hour => {
            
                            const dateObject = new Date(hour.dt * 1000);
                            const hourTime = dateObject.toLocaleString("en-US", {hour: "numeric"});
            
                            newTempChartToday.push(hour.temp);
                            newTempChartTodayLabels.push(hourTime);
                        });
            
                        setTempChartMin(newTempChartMin);
                        setTempChartMax(newTempChartMax);
                        setTempChartToday(newTempChartToday);
                        setTempChartLabels(newTempChartLabels);
                        setHumidityChartLabels(newTempChartLabels);
                        setHumidityChart(newHumidityChart);
                        setTempChartTodayLabels(newTempChartTodayLabels);
            
                    });
            
                    weatherService.getCurrentRainfall(locationData).then((data) => {
                        console.log(data);
                        data.data.forEach(day => {
                            newRainfallChart.push(day.precip);
                            newRainfallLabels.push(day.valid_date);
                        });

                        setRainfallChart(newRainfallChart);
                        setRainfallChartLabels(newRainfallLabels);
                    });            

                }, failureCallback);

        }

        
        // productService.getAirQuality().then((data) => {
        //     console.log(data);
        // });
    }, []);

    const tempData = {
        labels: tempChartLabels,
        datasets: [
            {
                label: 'Min Temp (in Celcius)',
                data: tempChartMin,
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: .4
            },
            {
                label: 'Max Temp (in Celcius)',
                data: tempChartMax,
                fill: false,
                backgroundColor: '#00bb7e',
                borderColor: '#00bb7e',
                tension: .4
            }
        ]
    };

    const tempTodayData = {
        labels: tempChartTodayLabels,
        datasets: [
            {
                label: 'Temp (in Celcius)',
                data: tempChartToday,
                fill: false,
                backgroundColor: '#2f4860',
                borderColor: '#2f4860',
                tension: .4
            }
        ]
    };

    const humidityData = {
        labels: humidityChartLabels,
        datasets: [
            {
                label: 'Humidity %',
                data: humidityChart,
                fill: false,
                backgroundColor: '#D22B2B',
                borderColor: '#D22B2B',
                tension: .4
            }
        ]
    };

    const rainfallData = {
        labels: rainfallChartLabels,
        datasets: [
            {
                label: 'Rainfall (in mm)',
                data: rainfallChart,
                fill: false,
                backgroundColor: '#5D3FD3',
                borderColor: '#5D3FD3',
                tension: .4
            }
        ]
    };


    return (
        <div className="grid">
            <div className="col-12 lg:col-6">
                {
                    isLoaded ? (
                        <div className="card">
                            <h5>Temperature Chart</h5>
                            {
                                tempChartSelected !== 'today' ? (
                                    <Chart type="line" data={tempData} />
                                ) : (
                                    <Chart type="line" data={tempTodayData} />
                                )
                            }
                            
                            <div>
                                <Button
                                    label="Today"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if(tempChartSelected !== 'today') setTempChartSelected('today');
                                    }}
                                    className="mr-2 mb-2"
                                ></Button>
                                <Button
                                    label="This Week"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if(tempChartSelected !== 'this_week') setTempChartSelected('this_week');
                                    }}
                                    className="mr-2 mb-2"
                                ></Button>
                            </div>

                            
                            
                        </div>
                    ) : (
                        <div className="border-round border-1 surface-border p-4">
                            <div className="flex mb-3">
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex justify-content-between mt-3">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>
                    )
                }
                
            </div>
            <div className="col-12 lg:col-6">
                {
                    isLoaded ? (
                        <div className="card">
                            <h5>Humidity Chart</h5>
                            <Chart type="line" data={humidityData} />
                            
                        </div>
                    ) : (
                        <div className="border-round border-1 surface-border p-4">
                            <div className="flex mb-3">
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex justify-content-between mt-3">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>
                    )
                }
                
            </div>

            <div className="col-12 lg:col-6">
                {
                    isLoaded ? (
                        <div className="card">
                    <h5>Rainfall Chart</h5>
                    <Chart type="line" data={rainfallData} />
                    
                </div>
                    ): (
                        <div className="border-round border-1 surface-border p-4">
                            <div className="flex mb-3">
                                <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                <div>
                                    <Skeleton width="10rem" className="mb-2"></Skeleton>
                                    <Skeleton width="5rem" className="mb-2"></Skeleton>
                                    <Skeleton height=".5rem"></Skeleton>
                                </div>
                            </div>
                            <Skeleton width="100%" height="150px"></Skeleton>
                            <div className="flex justify-content-between mt-3">
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                                <Skeleton width="4rem" height="2rem"></Skeleton>
                            </div>
                        </div>
                    )
                }
                
            </div>
        </div>
    )

}