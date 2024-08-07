import moment from 'moment-timezone';

export const isUpcomingPrayer = (currentPrayerTime, nextPrayerTime, timeZone, prevDay = false) => {
	if (!timeZone) return false;
	const now = moment().tz(timeZone);
	const currentDate = now.format('YYYY-MM-DD');
	let prevTime = moment.tz(`${currentDate} ${currentPrayerTime}`, 'YYYY-MM-DD HH:mm', timeZone);
	let currentTime = moment.tz(`${currentDate} ${nextPrayerTime}`, 'YYYY-MM-DD HH:mm', timeZone);
	if (prevDay) {
		currentTime = moment.tz(`${currentDate} ${nextPrayerTime}`, 'YYYY-MM-DD HH:mm', timeZone).add(1, 'day');
	}
	let result = now.isBetween(prevTime, currentTime, null, '[)');
	return result ? 'prayerTimeHighlight' : 'prayerTime';
}

export function capitalizeFirstLetter(str) {
	if (!str) return str;
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getLatLon(cityName, countryName) {
	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)},${encodeURIComponent(countryName)}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.length > 0) {
			let city = data[0].display_name.split(',')[0].trim();
			let country = data[0].display_name.split(',').pop().trim();
			return { lat: data[0].lat, lon: data[0].lon, city: city, country: country, display_name: data[0].display_name };
		}
		return false
	} catch(err) {
		throw err
	}
}

export async function getPrayerTimes(city, country, lat, lon, day, month, year = 2024) {
	day--
	let url = `https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${lat}&longitude=${lon}`;
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
		throw err
	}
}

export async function getHadith(book = null, hadithNum = null) {
	const books = [
		"sahih-bukhari",
		"sahih-muslim",
		"al-tirmidhi",
		"abu-dawood",
		"ibn-e-majah"
	];

	const numberOfHadithsByBook = [7563, 3033, 3956, 5274, 4341];
	const index = Math.floor(Math.random() * books.length);

	if (!book) {
		book = books[index];
	}
	if (!hadithNum) {
		hadithNum = Math.floor(Math.random() * numberOfHadithsByBook[index]) + 1;
	}

	const apiKey = '$2y$10$8uBNjmNTPfSlU8CrT4we4Ylst8LmF6kt0P9LW3SqwLM7zwEN0W';
	const apiUrl = `https://hadithapi.com/public/api/hadiths?apiKey=${apiKey}&book=${book}&hadithNumber=${hadithNum}`;
	console.log(apiUrl)
	try {
		const response = await fetch(apiUrl);
		const jsonData = await response.json();
		const hadithData = jsonData.hadiths.data[0];

		let hadithEnglish = hadithData.hadithEnglish
		if (hadithEnglish.length > 230) {
			let splitIndex = hadithEnglish.indexOf(' ', 230);
			if (splitIndex === -1) {
				splitIndex = 230;
			}
			hadithData.hadithEnglishRemaining = hadithEnglish.slice(splitIndex).trim();
			hadithEnglish = hadithEnglish.slice(0, splitIndex).trim() + '...';
		}

		return {
			bookNameID: book,
			book: hadithData.book.bookName,
			bookName: hadithData.chapter.chapterEnglish,
			header: hadithData.englishNarrator,
			id: hadithData.hadithNumber,
			hadith_english: hadithEnglish,
			hadith_english_remaining: hadithData.hadithEnglishRemaining
		};
	} catch (error) {
		throw error;
	}
}

export async function getTimeZoneFromLatLon(lat, lon) {
	const API_KEY = 'DAUEWLCYV2VA';
	const url = `https://api.timezonedb.com/v2.1/get-time-zone?key=${API_KEY}&format=json&by=position&lat=${lat}&lng=${lon}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		const data = await response.json();
		let timeZone = data.zoneName;
		let [area, subArea] = timeZone.split('/');
		timeZone = `${area}/${subArea}`

		return timeZone;
	} catch (error) {
		throw error;
	}
}

