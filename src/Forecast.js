const Forecast = props => {
    return (
        <div className="mt-5">
            <div className="card shadow">
                <div className="card-body">
                    <h5 className="card-title">{ props.forecast.name }</h5>
                    <div>
                        <h6 className="mb-3">{ props.forecast.shortForecast }</h6>
                        <div className="container">
                            <div className="row mb-3">
                                <div className="col-md-2">
                                    High:
                                </div>
                                <div className="col">
                                    { props.forecast.temperature }&deg;{ props.forecast.temperatureUnit }
                                </div>
                            </div>
                            <div className="row mb-3">
                                <div className="col-md-2">
                                    Wind:
                                </div>
                                <div className="col">
                                    { props.forecast.windSpeed } { props.forecast.windDirection }
                                </div>
                            </div>
                        </div>
                        <div className="accordion accordion-flush" id={ "detailedForecast" + props.forecast.number }>
                            <div className="accordion-item">
                                <h2 className="accordion-header"
                                    id={ "detailedForecastHeader" + props.forecast.number }>
                                    <button
                                        className="accordion-button"
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={ "#collapse" + +props.forecast.number }
                                        aria-expanded="true"
                                        aria-controls={ "collapse" + props.forecast.number }>
                                        Detailed forecast...
                                    </button>
                                </h2>
                                <div
                                    id={ "collapse" + props.forecast.number }
                                    className="accordion-collapse collapse collapsed"
                                    aria-labelledby={ "detailedForecastHeader" + props.forecast.number }
                                    data-bs-parent={ "#detailedForecast" + props.forecast.number }>
                                    <div className="accordion-body">
                                        { props.forecast.detailedForecast }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
        ;
}

export default Forecast;