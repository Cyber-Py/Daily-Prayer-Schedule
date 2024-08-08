import React, { useState, useRef } from "react";
import { getCityCountry } from "../prayerTimeUtils";

export default function GeolocationRequestButton({ setCityFunc, setCountryFunc, setErrorFunc, setDisplayCityFunc, setDisplayCountryFunc, handleSubmitFunc }) {
	const [isButtonDisabled, setIsButtonDisabled] = useState(false);
	const timeoutRef = useRef(null);

	const getLocation = () => {
		if (navigator.geolocation) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			setIsButtonDisabled(true);
			navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
			timeoutRef.current = setTimeout(() => {
				setIsButtonDisabled(false);
				timeoutRef.current = null;
			}, 5000);
		} else {
			setErrorFunc("Geolocation is not supported by this browser.");
			setIsButtonDisabled(false);
		}
	};

	const successCallback = (position) => {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		getCityCountry(latitude, longitude).then((cityCountry) => {
			setCityFunc(cityCountry.city);
			setDisplayCityFunc(cityCountry.city);
			setCountryFunc(cityCountry.country);
			setDisplayCountryFunc(cityCountry.country);
		}).catch(() => {
			setErrorFunc("Error fetching location. Please try again.");
		});
	};

	const errorCallback = (error) => {
		switch (error.code) {
			case error.PERMISSION_DENIED:
				setErrorFunc("User denied the request for Geolocation.");
				break;
			case error.POSITION_UNAVAILABLE:
				setErrorFunc("Location information is unavailable.");
				break;
			case error.TIMEOUT:
				setErrorFunc("The request to get user location timed out.");
				break;
			case error.UNKNOWN_ERROR:
				setErrorFunc("An unknown error occurred.");
				break;
			default:
				setErrorFunc("An unexpected error occurred.");
		}
	};

	return <button onClick={getLocation} disabled={isButtonDisabled}>Get Location</button>;
}
