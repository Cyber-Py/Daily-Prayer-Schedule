import { useState, useEffect } from 'react'
import getPrayerTimes from './getPrayerTimes'

export default function PrayerTimes() {
	const [data, setData] = useState(null)

	const estDate = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
	const [month, day, year] = estDate.split('/')

	useEffect(() => {
		setData(null)
		getPrayerTimes('Ajax', 'Canada', day, month, year.slice(0, 4)).then((response) => {
			setData(response);
			document.title = `${response.meta.location.city}, ${response.meta.location.country} | ${response.date.gregorian.day} ${response.date.gregorian.month} ${response.date.gregorian.year}`;
		});
	}, []);

	if (!data) {
		return <p>Loading...</p>
	}
	const isCurrentPrayer = (prevPrayerTime, currentPrayerTime) => {
		let currentDateTime = (new Date()).getTime();
		const currentPrayerDateTime = (new Date(`${year.slice(0,4)}-${month}-${day} ${currentPrayerTime}:00`)).getTime();
		const prevPrayerDateTime = (new Date(`${year.slice(0,4)}-${month}-${day} ${prevPrayerTime}:00`)).getTime();
		console.log(prevPrayerDateTime, currentDateTime, currentPrayerDateTime)
		console.log(prevPrayerDateTime < (currentDateTime) && (currentDateTime) < currentPrayerDateTime)
		if (prevPrayerDateTime < currentDateTime && currentDateTime <= currentPrayerDateTime) {
			return true
		} else {
			return false
		}
	};
	return (
		<div className='App'>
			<h1>Prayer Times in {data.meta.location.city}, {data.meta.location.country}</h1>
			<div class='dates'>
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
						<td className={isCurrentPrayer(data.timings.Isha, data.timings.Fajr) ? 'highlight' : ''}>{data.timings.Isha}</td>
					</tr>
				</tbody>
			</table>
		</div>
	)
}
