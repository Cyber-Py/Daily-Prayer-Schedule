export default async function verifyCityAndCountry(cityName, countryName) {
	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)},${encodeURIComponent(countryName)}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.length > 0) {
			return { lat: data[0].lat, lon: data[0].lon };
		}
		return false
	} catch(err) {
		console.log(err);
		return false;
	}
}