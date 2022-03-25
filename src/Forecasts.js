import { useEffect, useState } from "react";
import { handleWeatherGovError, weatherGovApiRequest } from "./utils/weatherGovApiRequest";

const Forecasts = props => {
    const [ dailyForecasts, setDailyForecasts ] = useState([]);

    useEffect(() => {
        if (props.forecastUrl) {
            weatherGovApiRequest(props.forecastUrl)
                .then(data => {
                    setDailyForecasts(data.properties.periods);
                })
                .catch(error => {
                    props.onError(handleWeatherGovError(error));
                });
        }
    }, [ props.forecastUrl ]);

    const forecasts = dailyForecasts.map((forecast, index) =>
        <div key={ index } className="mt-5">
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">{ forecast.name }</h5>
                    <div>
                        <h6 className="mb-3">{ forecast.shortForecast }</h6>
                        <div className="container">
                            <div className="row gx-0 mb-3">
                                <div className="col-lg-1 col-xl-2 col-xxl-1">
                                    High:
                                </div>
                                <div className="col-lg-7">
                                    { forecast.temperature }&deg;{ forecast.temperatureUnit }
                                </div>
                            </div>
                            <div className="row gx-0 mb-3">
                                <div className="col-lg-1 col-xl-2 col-xxl-1">
                                    Wind:
                                </div>
                                <div className="col-lg-7">
                                    { forecast.windSpeed } { forecast.windDirection }
                                </div>
                            </div>
                        </div>
                        <div className="accordion accordion-flush" id={ "detailedForecast" + forecast.number }>
                            <div className="accordion-item">
                                <h2 className="accordion-header"
                                    id={ "detailedForecastHeader" + forecast.number }>
                                    <button
                                        className="accordion-button"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={ "#collapse" + forecast.number }
                                        aria-expanded="true"
                                        aria-controls={ "collapse" + forecast.number }>
                                        Detailed forecast...
                                    </button>
                                </h2>
                                <div
                                    id={ "collapse" + forecast.number }
                                    className="accordion-collapse collapse collapsed"
                                    aria-labelledby={ "detailedForecastHeader" + forecast.number }
                                    data-bs-parent={ "#detailedForecast" + forecast.number }>
                                    <div className="accordion-body">
                                        { forecast.detailedForecast }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>{ forecasts }</div>
    );
}

export default Forecasts;