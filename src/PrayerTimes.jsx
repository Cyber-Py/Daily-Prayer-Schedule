import React, { useState, useEffect } from 'react';
import getPrayerTimes from './getPrayerTimes';
import getLatLon from './getLatLon';
import capatilazeFirstLetter from './capitalizeFirstLetter';
import getTimeZoneFromLatLon from './getTimeZoneFromLatLon';
import moment from 'moment-timezone';
import TipModal from './TipModal';

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
		setCity(capatilazeFirstLetter(element.target.value))
		setSubmitted(false)
	};
	const handleChangeCountry = (element) => {
		setCountry(capatilazeFirstLetter(element.target.value))
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

	const isUpcomingPrayer = (currentPrayerTime, nextPrayerTime, nextDay = false) => {
		if (!timeZone) return false;
		const now = moment().tz(timeZone);
		const currentDate = now.format('YYYY-MM-DD');
		let prevTime = moment.tz(`${currentDate} ${currentPrayerTime}`, 'YYYY-MM-DD HH:mm', timeZone);
		let currentTime = moment.tz(`${currentDate} ${nextPrayerTime}`, 'YYYY-MM-DD HH:mm', timeZone);
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
					<div className='prayerTimings'>
						<div className={isUpcomingPrayer(data.timings.Isha, data.timings.Fajr)}>
							<p className='upcoming'>Upcoming</p>
							<p>Fajr</p>
							<p>{data.timings.Fajr}</p>
						</div>
						<div className={isUpcomingPrayer(data.timings.Fajr, data.timings.Sunrise)}>
							<p className='upcoming'>Upcoming</p>
							<p>Sunrise</p>
							<p>{data.timings.Sunrise}</p>
						</div>
						<div className={isUpcomingPrayer(data.timings.Sunrise, data.timings.Dhuhr)}>
							<p className='upcoming'>Upcoming</p>
							<p>Dhuhr</p>
							<p>{data.timings.Dhuhr}</p>
						</div>
						<div className={isUpcomingPrayer(data.timings.Dhuhr, data.timings.Asr)}>
							<p className='upcoming'>Upcoming</p>
							<p>Asr</p>
							<p>{data.timings.Asr}</p>
						</div>
						<div className={isUpcomingPrayer(data.timings.Asr, data.timings.Maghrib)}>
							<p className='upcoming'>Upcoming</p>
							<p>Maghrib</p>
							<p>{data.timings.Maghrib}</p>
						</div>
						<div className={isUpcomingPrayer(data.timings.Maghrib, data.timings.Isha)}>
							<p className='upcoming'>Upcoming</p>
							<p>Isha</p>
							<p>{data.timings.Isha}</p>
						</div>
					</div>
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
