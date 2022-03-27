import { useEffect, useState } from "react";
import { handleWeatherGovError, weatherGovApiRequest } from "./utils/weatherGovApiRequest";

const Forecasts = props => {
    const [ dailyForecasts, setDailyForecasts ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const { forecastUrl, onError } = props;

    useEffect(() => {
        setDailyForecasts([]);
        if (forecastUrl) {
            setIsLoading(true);
            weatherGovApiRequest(forecastUrl)
                .then(data => {
                    setDailyForecasts(data.properties.periods);
                })
                .catch(error => {
                    onError(handleWeatherGovError(error));
                })
                .then(() => {
                    setIsLoading(false);
                });
        }
    }, [ forecastUrl, onError ]);

    const forecasts = dailyForecasts.map((forecast, index) =>
        <div key={ index } className="list-group-item">
            <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{ forecast.name }</h5>
                <small>{ forecast.temperature }&deg;{ forecast.temperatureUnit }</small>
            </div>
            <div className="d-flex w-100 justify-content-between">
                <p className="mb-1">{ forecast.shortForecast }</p>
                <small>{ forecast.windSpeed } { forecast.windDirection }</small>
            </div>
            <small>{ forecast.detailedForecast }</small>
        </div>
    );

    return (
        <div className="card shadow">
            <div className="card-body">
                <h5 className="card-title">Daily Forecast</h5>
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

export default Forecasts;