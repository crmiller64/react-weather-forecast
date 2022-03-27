import { useEffect, useState } from "react";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding";

import { handleWeatherGovError, weatherGovApiRequest } from "./utils/weatherGovApiRequest";
import addFormValidation from "./utils/addFormValidation";
import states from "./utils/usStates"

const Coordinates = props => {
    const [ city, setCity ] = useState("");
    const [ state, setState ] = useState("");
    const [ observationStations, setObservationStations ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(false);

    const { latitude, longitude } = props.coordinates;
    const { observationStationUrl, onSubmit, onError } = props;

    const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const geocodingService = Geocoding({ accessToken: mapboxToken, fuzzyMatch: false });

    const handleSubmit = event => {
        event.preventDefault();

        setIsLoading(true);
        setObservationStations([]);
        geocodingService
            .forwardGeocode({
                query: `${ city }, ${ state }`,
                limit: 1
            })
            .send()
            .then(response => {
                const [ longitude, latitude ] = response.body.features[0].geometry.coordinates;
                onSubmit(latitude, longitude);
            }, error => {
                console.log(error);
                onError({
                    message: "A problem occurred while getting coordinates for the given city and state. " +
                        "Please check the console log for details.",
                    error: error
                });
            })
            .then(() => {
                setIsLoading(false);
            });
    }

    const stateOptions = states.map((state, index) =>
        <option key={ state.abbreviation } value={ state.abbreviation }>
            { state.name }
        </option>
    );

    useEffect(() => {
        addFormValidation();
    });

    useEffect(() => {
        setObservationStations([]);
        if (observationStationUrl) {
            setIsLoading(true);
            weatherGovApiRequest(observationStationUrl)
                .then(data => {
                    setObservationStations(data.features)
                })
                .catch(error => {
                    onError(handleWeatherGovError(error));
                })
                .then(() => {
                    setIsLoading(false);
                });
        }
    }, [ observationStationUrl, onError ]);

    return (
        <div className="card shadow">
            <div className="card-body">
                <h5 className="card-title">Location</h5>
                <form className="validated-form" onSubmit={ handleSubmit } noValidate>
                    <div className="mb-3">
                        <label htmlFor="city" className="form-label">City</label>
                        <input
                            className="form-control"
                            type="text"
                            id="city"
                            name="city"
                            value={ city }
                            required
                            onChange={ event => setCity(event.target.value) }
                        />
                        <div className="invalid-feedback">
                            A city is required.
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <select
                            className="form-select"
                            aria-label="US states"
                            id="state"
                            name="state"
                            value={ state }
                            onChange={ event => setState(event.target.value) }
                            required
                            size="10"
                        >
                            { stateOptions }
                        </select>
                        <div className="invalid-feedback">
                            A state is required.
                        </div>
                    </div>
                    <div className="mb-3">
                        <button className="btn btn-primary">Submit</button>
                    </div>
                    { isLoading &&
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    }
                    { !isLoading && props.coordinates &&
                        <div className="mb-3">
                                <span className="form-text">
                                    Your coordinates are: {
                                    `${ latitude.toFixed(2) }, 
                                    ${ longitude.toFixed(2) }`
                                }
                                </span>
                        </div>
                    }
                    { !isLoading && observationStations.length > 0 &&
                        <div className="mb-3">
                                <span className="form-text">
                                    Your nearest observation station is: {
                                    `${ observationStations[0].properties.name } 
                                    (${ observationStations[0].properties.stationIdentifier })`
                                }
                                </span>
                        </div>
                    }
                </form>
            </div>
        </div>
    );
}

export default Coordinates;