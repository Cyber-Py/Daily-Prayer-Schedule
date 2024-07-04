export default async function(lat, lon) {
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
