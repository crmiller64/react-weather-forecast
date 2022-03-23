import { useEffect, useState } from "react";
import Geocoding from "@mapbox/mapbox-sdk/services/geocoding";

import addFormValidation from "./utils/addFormValidation";

const Coordinates = (props) => {
    const [ city, setCity ] = useState("");
    const [ state, setState ] = useState("");
    const [ latitude, setLatitude ] = useState(0);
    const [ longitude, setLongitude ] = useState(0);

    const mapboxToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const geocodingService = Geocoding({ accessToken: mapboxToken });

    const handleSubmit = (event) => {
        // TODO add error handling if mapbox doesn't return anything (could flash error message and return user to form?)
        const geocodingResponse = geocodingService
            .forwardGeocode({
                query: `${ city }, ${ state }`,
                limit: 1
            })
            .send()
            .then(response => {
                console.log(response.body.features[0].geometry);
            }, error => {
                console.log(error);
            });

        event.preventDefault();
    }

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
                            <label htmlFor="longitude" className="form-label">State</label>
                            <input
                                className="form-control"
                                type="text"
                                id="state"
                                name="state"
                                value={ state }
                                required
                                onChange={ event => setState(event.target.value) }
                            />
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