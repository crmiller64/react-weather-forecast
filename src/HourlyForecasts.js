import { useEffect, useState } from "react";
import { handleWeatherGovError, weatherGovApiRequest } from "./utils/weatherGovApiRequest";

const HourlyForecasts = props => {
    const [ hourlyForecasts, setHourlyForecasts ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const getDateTime = (dateString) => {
        const d = new Date(dateString);
        return `${ d.toLocaleDateString() } ${ d.toLocaleTimeString() }`;
    }

    useEffect(() => {
        setHourlyForecasts([]);
        if (props.forecastHourlyUrl) {
            setIsLoading(true);
            weatherGovApiRequest(props.forecastHourlyUrl)
                .then(data => {
                    setHourlyForecasts(data.properties.periods);
                })
                .catch(error => {
                    props.onError(handleWeatherGovError(error));
                })
                .then(() => {
                    setIsLoading(false);
                });
        }
    }, [ props.forecastHourlyUrl ]);

    const forecasts = hourlyForecasts.map((forecast, index) =>
        <div key={ index } className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{ getDateTime(forecast.startTime) }</h5>
                <small>{ forecast.temperature }&deg;{ forecast.temperatureUnit }</small>
            </div>
            <div className="d-flex w-100 justify-content-between">
                <p className="mb-1">{ forecast.shortForecast }</p>
                <small>{ forecast.windSpeed } { forecast.windDirection }</small>
            </div>
        </div>
    );

    return (
        <div className="card shadow">
            <div className="card-body">
                <h5 className="card-title">Hourly Forecast</h5>
                { isLoading &&
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                }
                { !isLoading &&
                    <div className="list-group">
                        { forecasts }
                    </div>
                }
            </div>
        </div>
    );
}

export default HourlyForecasts;