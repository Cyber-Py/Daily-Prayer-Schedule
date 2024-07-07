import React from 'react';
import PrayerTimingsSection from './PrayerTimingsSection';

export default function PrayerTimings({ data, timeZone }) {
	return (
		<div className='prayerTimings'>
			<PrayerTimingsSection name='Fajr' prevPrayerTime={data.timings.Isha} currentPrayerTime={data.timings.Fajr} timeZone={timeZone} />
			<PrayerTimingsSection name='Sunrise' prevPrayerTime={data.timings.Fajr} currentPrayerTime={data.timings.Sunrise} timeZone={timeZone} />
			<PrayerTimingsSection name='Dhuhr' prevPrayerTime={data.timings.Sunrise} currentPrayerTime={data.timings.Dhuhr} timeZone={timeZone} />
			<PrayerTimingsSection name='Asr' prevPrayerTime={data.timings.Dhuhr} currentPrayerTime={data.timings.Asr} timeZone={timeZone} />
			<PrayerTimingsSection name='Maghrib' prevPrayerTime={data.timings.Asr} currentPrayerTime={data.timings.Maghrib} timeZone={timeZone} />
			<PrayerTimingsSection name='Isha' prevPrayerTime={data.timings.Maghrib} currentPrayerTime={data.timings.Isha} timeZone={timeZone} />
		</div>
	)
}