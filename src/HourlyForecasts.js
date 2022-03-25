import { useEffect, useState } from "react";
import { handleWeatherGovError, weatherGovApiRequest } from "./utils/weatherGovApiRequest";

const HourlyForecasts = props => {
    const [ hourlyForecasts, setHourlyForecasts ] = useState([]);

    useEffect(() => {
        if (props.forecastHourlyUrl) {
            weatherGovApiRequest(props.forecastHourlyUrl)
                .then(data => {
                    setHourlyForecasts(data.properties.periods);
                })
                .catch(error => {
                    props.onError(handleWeatherGovError(error));
                });
        }
    }, [ props.forecastHourlyUrl ]);

    const forecasts = hourlyForecasts.map((forecast, index) =>
        <div key={ index } className="mt-5">
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">{ forecast.number }</h5>
                    <div>
                        Forecast info here
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>{ forecasts }</div>
    );
}

export default HourlyForecasts;