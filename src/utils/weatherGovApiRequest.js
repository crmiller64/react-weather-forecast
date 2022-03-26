import axios from "axios";

export const weatherGovApiRequest = url => {
    return axios.get(url)
        .then(response => {
            return response.data;
        })
}

export const handleWeatherGovError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a non 200 status code
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        return { message: error.response.data.detail, error: error.response.data };
    } else if (error.request) {
        // The request was made but no response was received
        console.log(error.request);
        return {
            message: "Unable to get a response from weather.gov. Please try again later.",
            error: error.request
        };
    } else {
        // Something happened in setting up the request that triggered an error
        console.log('Error', error.message);
        return {
            message: "Unable to set up weather.gov request. Please check the console log for details.",
            error: error.message
        };
    }
}
