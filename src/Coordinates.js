import './Coordinates.css';

import { useEffect, useState } from "react";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding";

import addFormValidation from "./utils/addFormValidation";
import states from "./utils/usStates"

const Coordinates = (props) => {
    const [ city, setCity ] = useState("");
    const [ state, setState ] = useState("");
    const [ latitude, setLatitude ] = useState(0);
    const [ longitude, setLongitude ] = useState(0);

    const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const geocodingService = Geocoding({ accessToken: mapboxToken });

    const handleSubmit = (event) => {
        // TODO add error handling if mapbox doesn't return anything (could flash error message and return user to form?)
        geocodingService
            .forwardGeocode({
                query: `${ city }, ${ state }`,
                limit: 1,
            })
            .send()
            .then(response => {
                const [ lon, lat ] = response.body.features[0].geometry.coordinates;
                setLatitude(lat);
                setLongitude(lon);
            }, error => {
                console.log(error);
            });

        event.preventDefault();
    }

    const stateOptions = states.map((state, index) =>
        <option key={ state.abbreviation } value={ state.abbreviation }>
            { state.name }
        </option>
    );

    useEffect(() => {
        addFormValidation()
    });

    return (
        <div className="mt-5">
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
                        <div className="mb-3">
                            <span className="form-text">Your coordinates are: { latitude }, { longitude }</span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Coordinates;