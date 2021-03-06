import { useEffect, useState } from "react";
import { handleWeatherGovError, weatherGovApiRequest } from "./utils/weatherGovApiRequest";

const HourlyForecasts = props => {
    const [ hourlyForecasts, setHourlyForecasts ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const { forecastHourlyUrl, onError } = props;

    const getTime = (dateTimeString) => {
        const d = new Date(dateTimeString);
        return d.toLocaleTimeString();
    }

    const getDate = (dateTimeString) => {
        const d = new Date(dateTimeString);
        return d.toLocaleDateString();
    }

    useEffect(() => {
        setHourlyForecasts([]);
        if (forecastHourlyUrl) {
            setIsLoading(true);
            weatherGovApiRequest(forecastHourlyUrl)
                .then(data => {
                    setHourlyForecasts(data.properties.periods);
                })
                .catch(error => {
                    onError(handleWeatherGovError(error));
                })
                .then(() => {
                    setIsLoading(false);
                });
        }
    }, [ forecastHourlyUrl, onError ]);

    const forecasts = hourlyForecasts.map((forecast, index) =>
        <div key={ index } className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{ getTime(forecast.startTime) }</h5>
                <small>{ forecast.temperature }&deg;{ forecast.temperatureUnit }</small>
            </div>
            <div className="d-flex w-100 justify-content-between">
                <p className="mb-1">{ forecast.shortForecast }</p>
                <small>{ forecast.windSpeed } { forecast.windDirection }</small>
            </div>
            <small>{ getDate(forecast.startTime) }</small>
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