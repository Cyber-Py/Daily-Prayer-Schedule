import React, { useState } from 'react';
import { capitalizeFirstLetter, getLatLon, getPrayerTimes, getTimeZoneFromLatLon } from './prayerTimeUtils';
import TipModal from './TipModal';
import moment from 'moment-timezone';
import PrayerTimings from './PrayerTimings';

export default function PrayerTimes() {
	const [data, setData] = useState(null);
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [isValidLocation, setIsValidLocation] = useState(true);
	const [timeZone, setTimeZone] = useState(null);
	const [loading, setLoading] = useState(false);
	const [displayCity, setDisplayCity] = useState('');
	const [displayCountry, setDisplayCountry] = useState('');
	const [modalVisibility, setModalVisibility] = useState(false);
	const [locationFormVisibility, setLocationFormVisibility] = useState(true);
	
	const handleChangeCity = (element) => {
		setCity(capitalizeFirstLetter(element.target.value))
		setSubmitted(false)
	};
	const handleChangeCountry = (element) => {
		setCountry(capitalizeFirstLetter(element.target.value))
		setSubmitted(false)
	};

	const toggleModal = () => {
		setModalVisibility(!modalVisibility);
	}

	const handleHeadingClick = () => {
		setData(null)
		setCity('')
		setCountry('')
		setLocationFormVisibility(!locationFormVisibility);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		setCity(city.trim())
		setCountry(country.trim())
		setSubmitted(true);
		setLoading(true);
		setData(null);
		setIsValidLocation(true);
		setModalVisibility(false);
		setLocationFormVisibility(false);
		getLatLon(city, country)
			.then((response) => {
				if (response) {
					setCity(response.city);
					setCountry(response.country);
					setDisplayCity(response.city);
					setDisplayCountry(response.country);
					getTimeZoneFromLatLon(response.lat, response.lon).then((timeZoneData) => {
						console.log(timeZoneData)
						console.log(response.lat, response.lon)
						setTimeZone(timeZoneData)
						const momentDate = moment.tz(timeZone).toDate().toLocaleString();
						console.log(momentDate)
						const date = moment.tz(timeZone).valueOf();
						console.log(date)
						const [month, day, year] = momentDate.split('/');
						console.log(month)
						getPrayerTimes(city, country, response.lat, response.lon, day, month, year.slice(0, 4))
							.then((prayerTimesResponse) => {
								setData(prayerTimesResponse);
								document.title = `${city}, ${country} | ${prayerTimesResponse.date.gregorian.day} ${prayerTimesResponse.date.gregorian.month} ${prayerTimesResponse.date.gregorian.year}`;
								setLoading(false);
							})
							.catch((error) => {
								setLocationFormVisibility(true)
								setIsValidLocation(false);
								setLoading(false);
							});
					})
					.catch((error) => {
						setLocationFormVisibility(true)
						setIsValidLocation(false);
						setLoading(false);
					})
				} else {
					setLocationFormVisibility(true)
					setIsValidLocation(false);
					setLoading(false);
					document.title = 'Prayer Times'
				}
			})
			.catch((error) => {
				setLocationFormVisibility(true)
				setIsValidLocation(false);
				setLoading(false);
			});
	};
	
	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div className='App'>
			{locationFormVisibility && (
				<div className='locationForm'>
					<form onSubmit={handleSubmit}>
						<input value={city} onChange={handleChangeCity} placeholder="Enter city" />
						<input value={country} onChange={handleChangeCountry} placeholder="Enter country" />
						<button type="submit">Submit</button>
					</form>
				</div>
			)}
			{!isValidLocation && submitted && <p className='locationResult'>{city}, {country} is not a valid location</p>}
			{data && isValidLocation && (
				<div className='locationInfo'>
					<div className='prayerTimes'>
						<h1 onClick={handleHeadingClick}>Prayer Times in {displayCity}, {displayCountry}</h1>
						<span></span>
						<div className='dates'>
							<p>{data.date.gregorian.weekday} the {data.date.gregorian.day}, {data.date.gregorian.month} {data.date.gregorian.year}</p>
							<p>{data.date.hijri.weekday} the {data.date.hijri.day}, {data.date.hijri.month} {data.date.hijri.year}</p>
						</div>
						<PrayerTimings data={data} timeZone={timeZone}/>
					</div>
				</div>
			)}
			{data && isValidLocation && (
				<div className='tipDiv'>
					<p className='tip' onClick={toggleModal}>It's best to wait at least 5 minutes before praying.</p>
				</div>
			)}
			{modalVisibility && <TipModal onClose={toggleModal} />}
		</div>
	);
}
