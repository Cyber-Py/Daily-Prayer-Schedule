export default async function getPrayerTimes(city, country, lat, lon, day, month, year = 2024) {
	day--
	let url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}&method=2`;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			const unavaliableData = await response.json();
			throw new Error(`Code: ${unavaliableData.code} | Status: ${unavaliableData.status} | Reason: ${unavaliableData.data}`);
		}
		const data = await response.json();
		let prayerTimesTimings = data["data"][day].timings;
		Object.keys(prayerTimesTimings).forEach(key => {
			prayerTimesTimings[key] = prayerTimesTimings[key].slice(0, 5);
		});
		let prayerTimesDate = data["data"][day].date;
		let prayerTimesMeta = data["data"][day].meta;
		const ordinalIndicator = (n) => {
			n = parseInt(n).toString()
			if (n.slice(-1) == 1) {
				return n + 'st'
			} else if (n.slice(-1) == 2) {
				return n + 'nd'
			} else if (n.slice(-1) == 3) {
				return n + 'rd'
			} else {
				return n + 'th'
			}
		}
		return {
			timings: {
				...prayerTimesTimings
			},
			date: {
				gregorian: {
					weekday: prayerTimesDate.gregorian.weekday.en,
					day: ordinalIndicator(prayerTimesDate.gregorian.day),
					month: prayerTimesDate.gregorian.month.en,
					year: prayerTimesDate.gregorian.year
				},
				hijri: {
					weekday: prayerTimesDate.hijri.weekday.en,
					day: ordinalIndicator(prayerTimesDate.hijri.day),
					month: prayerTimesDate.hijri.month.en,
					year: prayerTimesDate.hijri.year
				}
			},
			meta: {
				location: {
					city: city,
					country: country,
					coordinates: {
						latitude: prayerTimesMeta.latitude,
						longitude: prayerTimesMeta.longitude
					}
				},
				method: {
					name: prayerTimesMeta.method.name,
					params: { ...prayerTimesMeta.method.params }
				},
				offsets: prayerTimesMeta.offset
			}
		}
	} catch (err) {
		const errorMessage = `A problem has occured while getting the prayer times:\n${err}`;
		console.log(errorMessage);
		return errorMessage;
	}
}
