import React, { useState, useEffect } from 'react';
import { capitalizeFirstLetter, getLatLon, getPrayerTimes, getTimeZoneFromLatLon, getHadith } from './prayerTimeUtils';
import TipModal from './components/TipModal';
import PrayerTimings from './components/PrayerTimings';
import moment from 'moment-timezone';
import LoadingAnimation from './components/LoadingAnimation';
import HadithCard from './components/HadithCard';
import HadithInfo from './components/HadithInfo';

export default function PrayerTimes() {
	const [data, setData] = useState(null);
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [isValidLocation, setIsValidLocation] = useState(true);
	const [timeZone, setTimeZone] = useState(null);
	const [prayerTimeInfoLoading, setPrayerTimeInfoLoading] = useState(false);
	const [hadithInfoLoading, setHadithInfoLoading] = useState(false);
	const [loading, setLoading] = useState(false);
	const [displayCity, setDisplayCity] = useState('');
	const [displayCountry, setDisplayCountry] = useState('');
	const [modalVisibility, setModalVisibility] = useState(false);
	const [locationFormVisibility, setLocationFormVisibility] = useState(true);
	const [hadith, setHadith] = useState(null);
	const [hadithInfoVisibility, setHadithInfoVisibility] = useState(false);
	const [hadithInfoLoading2, setHadithInfoLoading2] = useState(false);

	const handleChangeCity = (element) => {
		setCity(capitalizeFirstLetter(element.target.value))
		setSubmitted(false)
	};
	const handleChangeCountry = (element) => {
		setCountry(capitalizeFirstLetter(element.target.value))
		setSubmitted(false)
	};

	const toggleModal = () => {
		setModalVisibility(!modalVisibility);
	}

	const handleHeadingClick = () => {
		setData(null)
		setCity('')
		setCountry('')
		document.title = 'Prayer Times'
		setLocationFormVisibility(!locationFormVisibility);
	}

	const toggleHadithInfoVisibility = () => {
		setHadithInfoVisibility(!hadithInfoVisibility);
	}

	const getNewHadith = () => {
		setHadithInfoLoading2(true);
		getHadith(city, country).then((data) => {
			setHadith(data);
			setHadithInfoLoading2(false);
		});
	}
	
	const handleSubmit = (event) => {
		event.preventDefault();
		setCity(city.trim())
		setCountry(country.trim())
		setSubmitted(true);
		setPrayerTimeInfoLoading(true);
		setHadithInfoLoading(true);
		setData(null);
		setIsValidLocation(true);
		setModalVisibility(false);
		setLocationFormVisibility(false);
		getLatLon(city, country)
			.then((response) => {
				if (response) {
					setCity(response.city);
					setCountry(response.country);
					setDisplayCity(response.city);
					setDisplayCountry(response.country);
					getTimeZoneFromLatLon(response.lat, response.lon).then((timeZoneData) => {
						setTimeZone(timeZoneData)
						const momentDate = moment.tz(timeZone).toDate().toLocaleString();
						const [month, day, year] = momentDate.split('/');
						getPrayerTimes(city, country, response.lat, response.lon, day, month, year.slice(0, 4))
							.then((prayerTimesResponse) => {
								setData(prayerTimesResponse);
								document.title = `${city}, ${country} | ${prayerTimesResponse.date.gregorian.day} ${prayerTimesResponse.date.gregorian.month} ${prayerTimesResponse.date.gregorian.year}`;
								setPrayerTimeInfoLoading(false);
							})
							.catch((error) => {
								setLocationFormVisibility(true)
								setIsValidLocation(false);
								setPrayerTimeInfoLoading(false);
								setHadithInfoLoading(false);
							});
					})
					.catch((error) => {
						setLocationFormVisibility(true)
						setIsValidLocation(false);
						setPrayerTimeInfoLoading(false);
						setHadithInfoLoading(false);
					})
				} else {
					setLocationFormVisibility(true)
					setIsValidLocation(false);
					setPrayerTimeInfoLoading(false);
					setHadithInfoLoading(false);
					document.title = 'Prayer Times'
				}
			})
			.catch((error) => {
				setLocationFormVisibility(true)
				setIsValidLocation(false);
				setPrayerTimeInfoLoading(false);
				setHadithInfoLoading(false);
			});
		getHadith()
			.then((response) => {
				setHadith(response)
				setHadithInfoLoading(false);
			})
	};

	useEffect(() => {
		if (!prayerTimeInfoLoading && !hadithInfoLoading) {
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [prayerTimeInfoLoading, hadithInfoLoading])

	if (loading) {
		return <LoadingAnimation />;
	}

	return (
		<div className='App'>
			{locationFormVisibility && (
				<div className='locationForm'>
					<form onSubmit={handleSubmit}>
						<input value={city} onChange={handleChangeCity} placeholder="Enter city" />
						<input value={country} onChange={handleChangeCountry} placeholder="Enter country" />
						<button type="submit">Submit</button>
					</form>
				</div>
			)}
			{!isValidLocation && submitted && <p className='locationResult'>{city}, {country} is not a valid location</p>}
			{data && hadith && isValidLocation && (
				<div className="locationInfoContainer">
					<div className="locationInfo">
						<div className="prayerTimes">
							<h1>
								<i className="fa-solid fa-magnifying-glass-location" onClick={handleHeadingClick}></i>
								Prayer Times in {displayCity}, {displayCountry}
							</h1>
							<span></span>
							<div className="dates">
								<p>{data.date.gregorian.weekday} the {data.date.gregorian.day}, {data.date.gregorian.month} {data.date.gregorian.year}</p>
								<p>{data.date.hijri.weekday} the {data.date.hijri.day}, {data.date.hijri.month} {data.date.hijri.year}</p>
							</div>
							<PrayerTimings data={data} timeZone={timeZone} />
						</div>
					</div>
					<HadithCard hadithObject={hadith} onInfoClick={toggleHadithInfoVisibility} onRegenerateClick={getNewHadith} isLoading={hadithInfoLoading2}/>
				</div>
			)}
			{data && isValidLocation && (
				<div className='tipDiv'>
					<p className='tip'>It's best to wait at least 5 minutes before praying.</p>
					<i className="fa-solid fa-circle-info" onClick={toggleModal}></i>
				</div>
			)}
			{modalVisibility && <TipModal onClose={toggleModal} />}
			{hadithInfoVisibility && <HadithInfo hadithObject={hadith} onClose={toggleHadithInfoVisibility} />}
		</div>
	);
}
