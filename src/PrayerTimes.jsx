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

	let month;
	let day;
	let year;

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
								document.title = `${prayerTimesResponse.meta.location.city}, ${prayerTimesResponse.meta.location.country} | ${prayerTimesResponse.date.gregorian.day} ${prayerTimesResponse.date.gregorian.month} ${prayerTimesResponse.date.gregorian.year}`;
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
				}
			})
			.catch((error) => {
				setIsValidLocation(false);
				setLoading(false);
			});
	};

	const isCurrentPrayer = (prevPrayerTime, currentPrayerTime, nextDay = false) => {
		const momentDate = moment.tz(timeZone).toDate().toLocaleString();
		const currentDateTime = moment.tz(timeZone).valueOf();
		const [month, day, year] = momentDate.split('/');
		let newDay = day;
		if (nextDay) {
			newDay++;
		}
		const currentPrayerDateTime = new Date(`${year.slice(0, 4)}-${month}-${newDay} ${currentPrayerTime}:00`).getTime();
		console.log(currentPrayerDateTime)
		const prevPrayerDateTime = new Date(`${year.slice(0, 4)}-${month}-${day} ${prevPrayerTime}:00`).getTime();
		return prevPrayerDateTime < currentDateTime && currentDateTime <= currentPrayerDateTime;
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
				<div className='prayerTimes'>
					<h1>Prayer Times in {data.meta.location.city}, {data.meta.location.country}</h1>
					<div className='dates'>
						<p>{data.date.gregorian.weekday} the {data.date.gregorian.day}, {data.date.gregorian.month} {data.date.gregorian.year}</p>
						<p>{data.date.hijri.weekday} the {data.date.hijri.day}, {data.date.hijri.month} {data.date.hijri.year}</p>
					</div>
					<table>
						<thead>
							<tr>
								<th>Fajr</th>
								<th>Dhuhr</th>
								<th>Asr</th>
								<th>Maghrib</th>
								<th>Isha</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className={isCurrentPrayer(data.timings.Fajr, data.timings.Dhuhr) ? 'highlight' : ''}>{data.timings.Fajr}</td>
								<td className={isCurrentPrayer(data.timings.Dhuhr, data.timings.Asr) ? 'highlight' : ''}>{data.timings.Dhuhr}</td>
								<td className={isCurrentPrayer(data.timings.Asr, data.timings.Maghrib) ? 'highlight' : ''}>{data.timings.Asr}</td>
								<td className={isCurrentPrayer(data.timings.Maghrib, data.timings.Isha) ? 'highlight' : ''}>{data.timings.Maghrib}</td>
								<td className={isCurrentPrayer(data.timings.Isha, data.timings.Fajr, true) ? 'highlight' : ''}>{data.timings.Isha}</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
