import { useEffect, useState } from "react";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding";

import { handleWeatherGovError, weatherGovApiRequest } from "./utils/weatherGovApiRequest";
import addFormValidation from "./utils/addFormValidation";
import states from "./utils/usStates"

const Coordinates = props => {
    const [ city, setCity ] = useState("");
    const [ state, setState ] = useState("");
    const [ observationStations, setObservationStations ] = useState([]);

    const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const geocodingService = Geocoding({ accessToken: mapboxToken });

    const handleSubmit = event => {
        event.preventDefault();

        geocodingService
            .forwardGeocode({
                query: `${ city }, ${ state }`,
                limit: 1,
            })
            .send()
            .then(response => {
                const [ longitude, latitude ] = response.body.features[0].geometry.coordinates;
                props.onSubmit(latitude, longitude);
            }, error => {
                console.log(error);
                props.onError({
                    message: "A problem occurred while getting coordinates for the given city and state. " +
                        "Please check the console log for details.",
                    error: error
                });
            });
    }

    const stateOptions = states.map((state, index) =>
        <option key={ state.abbreviation } value={ state.abbreviation }>
            { state.name }
        </option>
    );

    const coordinates = () => {
        if (props.coordinates.latitude && props.coordinates.longitude) {
            return { latitude: props.coordinates.latitude, longitude: props.coordinates.longitude };
        }
        return false;
    }

    useEffect(() => {
        addFormValidation();
    });

    useEffect(() => {
        if (props.observationStationUrl) {
            weatherGovApiRequest(props.observationStationUrl)
                .then(data => {
                    setObservationStations(data.features)
                })
                .catch(error => {
                    props.onError(handleWeatherGovError(error));
                });
        }
    }, [ props.observationStationUrl ]);

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
                    { coordinates() &&
                        <div className="mb-3">
                                <span className="form-text">
                                    Your coordinates are: {
                                    `${ coordinates().latitude.toFixed(2) }, 
                                    ${ coordinates().longitude.toFixed(2) }`
                                }
                                </span>
                        </div>
                    }
                    { observationStations.length > 0 &&
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