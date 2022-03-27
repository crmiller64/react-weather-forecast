# ☀️ USA Weather Forecast

A simple weather forecast web app that consumes the NWS (National Weather Service) web API on weather.gov. Made with
JavaScript and React.

## Setup

### Mapbox Access Token

This app uses the Mapbox web API to get the geographic coordinates (latitude, longitude) for a location submitted by the
user. An access token is required to use Mapbox's web API - as such you will need to do a bit of setup to provide the
app with a valid access token before running. If you don't have an access token for the Mapbox API you will first need
to create an account with Mapbox, then you can find your access token(s) on your account dashboard (more info on
Mapbox's access tokens can be found [here](https://docs.mapbox.com/help/getting-started/access-tokens/)).

This app is configured to read the Mapbox access token through the
`REACT_APP_MAPBOX_TOKEN` environment variable. Once you have your Mapbox access token you can assign it to the
`REACT_APP_MAPBOX_TOKEN` environment variable with the following steps:

1. Open terminal
2. `cd react-weather-forecast`
3. `touch .env`
4. `echo "REACT_APP_MAPBOX_TOKEN=myMapboxToken" >> .env`
    1. Replace `myMapboxToken` with your access token

After running through the above steps you should have an `.env` file in the `react-weather-forecast` that contains your
Mapbox access token - you can verify this with the following command:

```shell
cat .env
```

Your output should look like:

```shell
REACT_APP_MAPBOX_TOKEN=myMapboxToken
```

Where `myMapboxToken` above will be your access token.

## Running

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Learn More

* [React](https://reactjs.org/)
* [National Weather Service API](https://www.weather.gov/documentation/services-web-api)
* [Mapbox API](https://docs.mapbox.com/api/overview/)
* [Mapbox SDK](https://www.npmjs.com/package/@mapbox/mapbox-sdk)