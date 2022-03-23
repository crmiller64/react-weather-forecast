import { useEffect, useState } from "react";
import addFormValidation from "./utils/addFormValidation";

const Coordinates = (props) => {
    const [ city, setCity ] = useState("");
    const [ state, setState ] = useState("");
    const [ latitude, setLatitude ] = useState(0);
    const [ longitude, setLongitude ] = useState(0);

    const handleSubmit = (event) => {
        alert("Coordinates have been submitted!");
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