import './App.css';
import { useEffect, useRef, useState } from "react";
import axios from "axios";

import Coordinates from "./Coordinates";
import Forecast from "./Forecast";

import shallowEqual from "./utils/shallowEqual";

const App = () => {
    const [ coordinates, setCoordinates ] = useState({ latitude: 0, longitude: 0 });
    const [ todayForecast, setTodayForecast ] = useState(null);
    const [ forecastPeriods, setForecastPeriods ] = useState([]);
    const [ observationStation, setObservationStation ] = useState(null);

    const previousCoordinatesRef = useRef({ latitude: 0, longitude: 0 });

    const [ error, setError ] = useState(null);

    const handleSubmit = (latitude, longitude) => {
        setCoordinates({ latitude: latitude, longitude: longitude });
    }

    const handleError = (error) => {
        setError({
            message: "A problem occurred while getting coordinates for the given city and state. " +
                "Please check the console log for details.",
            error: error
        });
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
            const weatherGovApiRequest = (url) => {
                return axios.get(url, {
                    headers: { 'User-Agent': process.env.REACT_APP_WEATHER_GOV_USER_AGENT }
                })
                    .then(response => {
                        return response.data;
                    });
            }

            let forecastUrl = null;
            let forecastHourlyUrl = null;
            let observationStationsUrl = null;

            weatherGovApiRequest(
                `https://api.weather.gov/points/${ coordinates.latitude },${ coordinates.longitude }`
            )
                .then(data => {
                    forecastUrl = data.properties.forecast;
                    forecastHourlyUrl = data.properties.forecastHourly;
                    observationStationsUrl = data.properties.observationStations;
                    // get daily forecast data
                    return weatherGovApiRequest(forecastUrl);
                })
                .then(data => {
                    setTodayForecast(data.properties.periods[0]);
                    setForecastPeriods(data.properties.periods.slice(1));
                    // get observation station data
                    return weatherGovApiRequest(observationStationsUrl);
                })
                .then(data => {
                    // the first station in the features array is the nearest to the given coordinates
                    setObservationStation(data.features[0]);
                    setError(null);
                    previousCoordinatesRef.current = coordinates;
                })
                .catch(error => {
                    if (error.response) {
                        // The request was made and the server responded with a non 200 status code
                        console.log(error.response.data);
                        console.log(error.response.status);
                        console.log(error.response.headers);
                        setError({ message: error.response.data.detail, error: error.response.data });
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                        setError({
                            message: "Unable to get forecast data from weather.gov. Please try again later.",
                            error: error.request
                        });
                    } else {
                        // Something happened in setting up the request that triggered an error
                        console.log('Error', error.message);
                        setError({
                            message: "Unable to set up weather.gov request. Please check the console log for details.",
                            error: error.message
                        });
                    }
                });
        }
    }, [ coordinates ])

    return (
        <div className="container my-5">
            { error &&
                <div className="alert alert-danger" role="alert">
                    { error.message }
                </div>
            }
            <h1>Weather Forecast (USA)</h1>
            <div className="row">
                <div className="col-sm-4 col-xl-6">
                    <Coordinates
                        onSubmit={ (latitude, longitude) => handleSubmit(latitude, longitude) }
                        onError={ (error) => handleError(error) }
                        coordinates={ coordinates }
                        observationStation={ observationStation }
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
