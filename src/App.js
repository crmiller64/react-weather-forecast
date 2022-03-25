import './App.css';
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import Coordinates from "./Coordinates";
import Forecast from "./Forecast";

import shallowEqual from "./utils/shallowEqual";

function App() {
    const [ coordinates, setCoordinates ] = useState({ latitude: 0, longitude: 0 });
    const [ todayForecast, setTodayForecast ] = useState(null);
    const [ forecastPeriods, setForecastPeriods ] = useState([]);

    const previousCoordinatesRef = useRef({ latitude: 0, longitude: 0 });

    const [ error, setError ] = useState(null);

    const handleSubmit = (latitude, longitude) => {
        setCoordinates({ latitude: latitude, longitude: longitude });
    }

    const forecasts = () => {
        if (forecastPeriods.length > 0) {
            return forecastPeriods.map((forecast, index) =>
                <Forecast key={ index } forecast={ forecast }/>
            );
        }
    }

    useEffect(() => {
        if (!shallowEqual(previousCoordinatesRef.current, coordinates)) {
            const fetchForecastUrl = () => {
                return axios.get(`https://api.weather.gov/points/${ coordinates.latitude },${ coordinates.longitude }`)
                    .then(response => {
                        return response.data.properties.forecast;
                    });
            }

            const fetchForecast = url => {
                return axios.get(url)
                    .then(response => {
                        return response.data.properties.periods;
                    });
            }

            fetchForecastUrl()
                .then(url => {
                    return fetchForecast(url);
                })
                .then(periods => {
                    setTodayForecast(periods[0]);
                    setForecastPeriods(periods.slice(1));
                    setError(null);
                    previousCoordinatesRef.current = coordinates;
                })
                .catch(error => {
                    if (error.response) {
                        // The request was made and the server responded with a non 200 status code
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        setError(error.response.data);
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                        setError({
                            detail: "Unable to get forecast data from weather.gov. Please try again later."
                        });
                    } else {
                        // Something happened in setting up the request that triggered an error
                        console.log('Error', error.message);
                        setError({
                            detail: "Unable to set up weather.gov request. Please check the console/logs for details."
                        });
                    }
                });
        }
    }, [ coordinates ])

    return (
        <div className="container mt-5">
            { error &&
                <div className="alert alert-danger" role="alert">
                    { error.detail }
                </div>
            }
            <h1>Weather Forecast (USA)</h1>
            <div className="row">
                <div className="col-sm-4 col-xl-6">
                    <Coordinates
                        onSubmit={ (latitude, longitude) => handleSubmit(latitude, longitude) }
                        coordinates={ coordinates }
                    />
                </div>
                { todayForecast &&
                    <div className="col-sm-8 col-xl-6">
                        <Forecast forecast={ todayForecast }/>
                    </div>
                }
                { forecastPeriods.length > 0 &&
                    <div className="col-12">
                        { forecasts() }
                    </div>
                }
            </div>
        </div>
    );
}

export default App;
