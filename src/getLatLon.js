export default async function getLatLon(cityName, countryName) {
	const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)},${encodeURIComponent(countryName)}`;

	try {
		const response = await fetch(url);
		const data = await response.json();

		if (data.length > 0) {
			let city = data[0].display_name.split(',')[0].trim();
			let country = data[0].display_name.split(',').pop().trim();
			return { lat: data[0].lat, lon: data[0].lon, city: city, country: country };
		}
		return false
	} catch(err) {
		throw err
	}
}