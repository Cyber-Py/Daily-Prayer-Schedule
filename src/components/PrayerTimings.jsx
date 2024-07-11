import React from 'react';
import PrayerTimingsSection from './PrayerTimingsSection';

export default function PrayerTimings({ data, timeZone }) {
	return (
		<div className='prayerTimings'>
			<PrayerTimingsSection name='Fajr' prevPrayerTime={data.timings.Isha} currentPrayerTime={data.timings.Fajr} timeZone={timeZone} prevDay={true}/>
			<PrayerTimingsSection name='Sunrise' prevPrayerTime={data.timings.Fajr} currentPrayerTime={data.timings.Sunrise} timeZone={timeZone} prevDay={false}/>
			<PrayerTimingsSection name='Dhuhr' prevPrayerTime={data.timings.Sunrise} currentPrayerTime={data.timings.Dhuhr} timeZone={timeZone} prevDay={false}/>
			<PrayerTimingsSection name='Asr' prevPrayerTime={data.timings.Dhuhr} currentPrayerTime={data.timings.Asr} timeZone={timeZone} prevDay={false}/>
			<PrayerTimingsSection name='Maghrib' prevPrayerTime={data.timings.Asr} currentPrayerTime={data.timings.Maghrib} timeZone={timeZone} prevDay={false}/>
			<PrayerTimingsSection name='Isha' prevPrayerTime={data.timings.Maghrib} currentPrayerTime={data.timings.Isha} timeZone={timeZone} prevDay={false}	/>
		</div>
	)
}