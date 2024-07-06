import React, { useState, useEffect } from 'react';
import getPrayerTimes from './getPrayerTimes';
import getLatLon from './getLatLon';
import capatilazeFirstLetter from './capitalizeFirstLetter';
import getTimeZoneFromLatLon from './getTimeZoneFromLatLon';
import moment from 'moment-timezone';

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

	
	const handleChangeCity = (element) => {
		setCity(capatilazeFirstLetter(element.target.value))
		setSubmitted(false)
	};
	const handleChangeCountry = (element) => {
		setCountry(capatilazeFirstLetter(element.target.value))
		setSubmitted(false)
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setSubmitted(true);
		setLoading(true);
		setData(null);
		setIsValidLocation(true);

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
								setIsValidLocation(false);
								setLoading(false);
							});
					})
					.catch((error) => {
						setIsValidLocation(false);
						setLoading(false);
					})
				} else {
					setIsValidLocation(false);
					setLoading(false);
					document.title = 'Prayer Times'
				}
			})
			.catch((error) => {
				setIsValidLocation(false);
				setLoading(false);
			});
	};

	const isCurrentPrayer = (prevPrayerTime, currentPrayerTime, nextDay = false) => {
		if (!timeZone) return false;
		const now = moment().tz(timeZone);
		const currentDate = now.format('YYYY-MM-DD');
		let prevTime = moment.tz(`${currentDate} ${prevPrayerTime}`, 'YYYY-MM-DD HH:mm', timeZone);
		let currentTime = moment.tz(`${currentDate} ${currentPrayerTime}`, 'YYYY-MM-DD HH:mm', timeZone);
		if (nextDay) {
			currentTime.add(1, 'day');
		}
		let result = now.isBetween(prevTime, currentTime, null, '[)');
		let newResult = (result ? 'prayerTimeHighlight' : 'prayerTime');
		return newResult
	};

	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div className='App'>
			<div className='locationForm'>
				<form onSubmit={handleSubmit}>
					<input value={city} onChange={handleChangeCity} placeholder="Enter city" />
					<input value={country} onChange={handleChangeCountry} placeholder="Enter country" />
					<button type="submit">Submit</button>
				</form>
			</div>
			{!isValidLocation && submitted && <p className='locationResult'>{city}, {country} is not a valid location</p>}
			{data && isValidLocation && (
			<div className='locationInfo'>
				<div className='prayerTimes'>
					<h1>Prayer Times in {displayCity}, {displayCountry}</h1>
					<div className='dates'>
						<p>{data.date.gregorian.weekday} the {data.date.gregorian.day}, {data.date.gregorian.month} {data.date.gregorian.year}</p>
						<p>{data.date.hijri.weekday} the {data.date.hijri.day}, {data.date.hijri.month} {data.date.hijri.year}</p>
					</div>

					<div className='prayerTimings'>
						<div className={isCurrentPrayer(data.timings.Fajr, data.timings.Sunrise)}>
							<p>Fajr</p>
							<p>{data.timings.Fajr}</p>
						</div>
						<div className={isCurrentPrayer(data.timings.Sunrise, data.timings.Dhuhr)}>
							<p>Sunrise</p>
							<p>{data.timings.Sunrise}</p>
						</div>
						<div className={isCurrentPrayer(data.timings.Dhuhr, data.timings.Asr)}>
							<p>Dhuhr</p>
							<p>{data.timings.Dhuhr}</p>
						</div>
						<div className={isCurrentPrayer(data.timings.Asr, data.timings.Maghrib)}>
							<p>Asr</p>
							<p>{data.timings.Asr}</p>
						</div>
						<div className={isCurrentPrayer(data.timings.Maghrib, data.timings.Isha)}>
							<p>Maghrib</p>
							<p>{data.timings.Maghrib}</p>
						</div>
						<div className={isCurrentPrayer(data.timings.Isha, data.timings.Fajr, true)}>
							<p>Isha</p>
							<p>{data.timings.Isha}</p>
						</div>
					</div>
				</div>
			</div>
			)}
		</div>
	);
}
