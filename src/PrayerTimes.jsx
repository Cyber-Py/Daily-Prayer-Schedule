import React, { useState, useEffect } from 'react';
import getPrayerTimes from './getPrayerTimes';
import getLatLon from './getLatLon';
import capatilazeFirstLetter from './capitalizeFirstLetter';

export default function PrayerTimes() {
	const [data, setData] = useState(null);
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [isValidLocation, setIsValidLocation] = useState(true);
	const [loading, setLoading] = useState(false);

	const date = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
	const [month, day, year] = date.split('/');

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
					getPrayerTimes(city, country, response.lat, response.lon, day, month, year.slice(0, 4))
						.then((response) => {
							setData(response);
							document.title = `${response.meta.location.city}, ${response.meta.location.country} | ${response.date.gregorian.day} ${response.date.gregorian.month} ${response.date.gregorian.year}`;
							setLoading(false);
						})
						.catch((error) => {
							setIsValidLocation(false);
							setLoading(false);
						});
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
		let currentDateTime = new Date().getTime();
		let newDay = day;
		if (nextDay) {
			newDay++;
		}
		const currentPrayerDateTime = new Date(`${year.slice(0, 4)}-${month}-${newDay} ${currentPrayerTime}:00`).getTime();
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
