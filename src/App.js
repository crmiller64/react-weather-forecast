import './App.css';
import { useEffect, useRef, useState } from "react";

import Coordinates from "./Coordinates";
import Forecasts from "./Forecasts";
import HourlyForecasts from "./HourlyForecasts";

import isShallowEqual from "./utils/objectShallowEqual";
import { weatherGovApiRequest, handleWeatherGovError } from "./utils/weatherGovApiRequest";

const App = () => {
    const [ coordinates, setCoordinates ] = useState({ latitude: 0, longitude: 0 });
    const [ forecastUrls, setForecastUrls ] = useState({});
    const [ error, setError ] = useState(null);

    const previousCoordinatesRef = useRef({ latitude: 0, longitude: 0 });

    const handleSubmit = (latitude, longitude) => {
        setCoordinates({ latitude: latitude, longitude: longitude });
    }

    const handleError = (error) => {
        setError(error);
    }

    useEffect(() => {
        if (!isShallowEqual(previousCoordinatesRef.current, coordinates)) {
            weatherGovApiRequest(
                `https://api.weather.gov/points/${ coordinates.latitude },${ coordinates.longitude }`
            )
                .then(data => {
                    setForecastUrls({
                        forecastUrl: data.properties.forecast,
                        forecastHourlyUrl: data.properties.forecastHourly,
                        observationStationsUrl: data.properties.observationStations
                    });
                })
                .catch(error => {
                    setError(handleWeatherGovError(error));
                });
        }
    }, [ coordinates ])

    return (
        <div className="container my-5 vh-100">
            { error &&
                <div className="alert alert-danger" role="alert">
                    { error.message }
                </div>
            }
            <h1>Weather Forecast (USA)</h1>
            <div className="row h-50 mt-5">
                <div className="col-sm-4 col-xl-6 mh-100">
                    <Coordinates
                        onSubmit={ (latitude, longitude) => handleSubmit(latitude, longitude) }
                        onError={ (error) => handleError(error) }
                        coordinates={ coordinates }
                        observationStationUrl={ forecastUrls.observationStationsUrl }
                    />
                </div>
                <div className="col-sm-8 col-xl-6 mh-100">
                    <HourlyForecasts
                        onError={ (error) => handleError(error) }
                        forecastHourlyUrl={ forecastUrls.forecastHourlyUrl }
                    />
                </div>
            </div>
            <div className="row mt-5 pb-5">
                <div className="col-12">
                    <Forecasts
                        onError={ (error) => handleError(error) }
                        forecastUrl={ forecastUrls.forecastUrl }
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
