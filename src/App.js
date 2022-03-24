import './App.css';
import { useEffect, useState } from "react";

import Coordinates from "./Coordinates";
import Forecast from "./Forecast";
import states from "./utils/usStates";

function App() {
    const [ coordinates, setCoordinates ] = useState({
        latitude: null,
        longitude: null
    });
    const [ todayForecast, setTodayForecast ] = useState(null);
    const [ forecastPeriods, setForecastPeriods ] = useState([]);

    const [ error, setError ] = useState(null);
    const [ isLoaded, setIsLoaded ] = useState(false);

    const handleSubmit = (latitude, longitude) => {
        setCoordinates({ latitude: latitude, longitude: longitude });
    }

    const fetchForecastUrl = () => {
        return new Promise((resolve, reject) => {
            fetch(`https://api.weather.gov/points/${ coordinates.latitude },${ coordinates.longitude }`)
                .then(res => res.json())
                .then(data => {
                    resolve(data.properties.forecast);
                })
                .catch(error => {
                    reject(error);
                })
        });
    }

    const fetchForecast = url => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setTodayForecast(data.properties.periods[0]);
                setForecastPeriods(data.properties.periods.slice(1));
            })
            .catch(error => {
                console.log(error);
            })
    }

    const forecasts = () => {
        if (forecastPeriods.length > 0) {
            return forecastPeriods.map((forecast, index) =>
                <Forecast key={ index } forecast={ forecast }/>
            );
        }
    }

    useEffect(() => {
        if (coordinates.latitude && coordinates.longitude) {
            fetchForecastUrl()
                .then(url => {
                    fetchForecast(url);
                })
                .catch(error => {
                    console.log(error);
                })
        }
    }, [ coordinates ])

    return (
        <div className="container mt-5">
            <h1>Weather Forecast (USA)</h1>
            <div className="row">
                <div className="col-6">
                    <Coordinates
                        onSubmit={ (latitude, longitude) => handleSubmit(latitude, longitude) }
                        coordinates={ coordinates }
                    />
                </div>
                { todayForecast &&
                    <div className="col-6">
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
