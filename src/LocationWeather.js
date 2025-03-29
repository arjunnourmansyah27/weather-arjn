import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Oval } from 'react-loader-spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFrown } from '@fortawesome/free-solid-svg-icons';
import './Global.css';

function LocationWeather() {
    const [weather, setWeather] = useState({ loading: true, data: null, error: false });
    const apiKey = 'f00c38e0279b7bc85480c3fe775d518c';

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const response = await axios.get(
                            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
                        );
                        setWeather({ loading: false, data: response.data, error: false });
                    } catch (error) {
                        setWeather({ loading: false, data: null, error: true });
                    }
                },
                () => {
                    setWeather({ loading: false, data: null, error: true });
                }
            );
        } else {
            setWeather({ loading: false, data: null, error: true });
        }
    }, []);

    return (
        <div className="location-weather">
            {weather.loading && (
                <>
                    <br />
                    <Oval type="Oval" color="#009DFF" secondaryColor="#A9A9A9" height={50} width={50} />
                </>
            )}
            {weather.error && (
                <>
                    <br />
                    <br />
                    <span className="error-message">
                        <FontAwesomeIcon icon={faFrown} />
                        <span style={{ fontSize: '20px' }}> Could not fetch location weather</span>
                    </span>
                </>
            )}
            {weather.data && (
                <div>
                    <div className="city-name">
                        <h2>
                            {weather.data.name}, <span>{weather.data.sys.country}</span>
                        </h2>
                    </div>
                    <div className="date">
                        <span>{new Date().toDateString()}</span>
                    </div>
                    <div className="icon-temp">
                        <img
                            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
                            alt={weather.data.weather[0].description}
                        />
                        {Math.round(weather.data.main.temp)}
                        <sup className="deg">°C</sup>
                    </div>
                    <div className="des-wind">
                        <p>{weather.data.weather[0].description.toUpperCase()}</p>
                        <p>Wind Speed: {weather.data.wind.speed}m/s</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LocationWeather;
