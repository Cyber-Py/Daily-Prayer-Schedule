import React from 'react';
import { isUpcomingPrayer } from './prayerTimeUtils';

export default function PrayerTimingsSection(props) {
	return (
		<div className={isUpcomingPrayer(props.prevPrayerTime, props.currentPrayerTime, props.timeZone)}>
			<p className='upcoming'>Upcoming</p>
			<p>{props.name}</p>
			<p>{props.currentPrayerTime}</p>
		</div>
	)
}