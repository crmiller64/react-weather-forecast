import './App.css';
import Coordinates from "./Coordinates";

function App() {
    return (
        <div className="container mt-5">
            <h1>Weather Forecast (USA)</h1>
            <div className="row">
                <div className="col-6">
                    <Coordinates/>
                </div>
                <div className="col-6">
                    <div className="mt-5">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Current Weather</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12">
                    <div className="mt-5">
                        <div className="card shadow">
                            <div className="card-body">
                                <h5 className="card-title">Forecast</h5>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
