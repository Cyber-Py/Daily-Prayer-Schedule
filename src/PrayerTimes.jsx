import React, { useState, useEffect } from 'react';
import { capitalizeFirstLetter, getLatLon, getPrayerTimes, getTimeZoneFromLatLon, getHadith } from './prayerTimeUtils';
import HadithInfo from './components/modals/HadithInfoModal';
import TipModal from './components/modals/TipModal';
import PrayerTimings from './components/PrayerTimings';
import moment from 'moment-timezone';
import LoadingAnimation from './components/LoadingAnimation';
import HadithCard from './components/HadithCard';
import HadithOptionsModal from './components/modals/HadithOptionsModal';
import GeolocationRequestButton from './components/GeolocationRequestButton';

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
	const [tipModalVisibility, setTipModalVisibility] = useState(false);
	const [locationFormVisibility, setLocationFormVisibility] = useState(true);
	const [isLoadingLocation, setIsLoadingLocation] = useState(false);
	const [hadith, setHadith] = useState(null);
	const [hadithInfoVisibility, setHadithInfoVisibility] = useState(false);
	const [hadithInfoLoading2, setHadithInfoLoading2] = useState(false);
	const [hadithBook, setHadithBook] = useState(null);
	const [hadithNumber, setHadithNumber] = useState(null);
	const [hadithOptionsVisibility, setHadithOptionsVisibility] = useState(false);
	const [initialHadithBook, setInitialHadithBook] = useState(null);
	const [initialHadithNumber, setInitialHadithNumber] = useState(null);
	const [error, setError] = useState(null);

	const handleChangeCity = (element) => {
		setCity(capitalizeFirstLetter(element.target.value));
		setSubmitted(false);
		setError(null); 
	};

	const handleChangeCountry = (element) => {
		setCountry(capitalizeFirstLetter(element.target.value));
		setSubmitted(false);
		setError(null); 
	};

	const toggleModal = () => {
		setTipModalVisibility(!tipModalVisibility);
	};

	const handleHeadingClick = () => {
		setData(null);
		setCity('');
		setCountry('');
		setHadithBook(null);
		setHadithNumber(null);
		document.title = 'Prayer Times';
		setLocationFormVisibility(!locationFormVisibility);
	};

	const toggleHadithInfoVisibility = () => {
		setHadithInfoVisibility(!hadithInfoVisibility);
	};

	const toggleHadithOptionsVisibility = () => {
		if (!hadithOptionsVisibility) {
			
			setInitialHadithBook(hadithBook);
			setInitialHadithNumber(hadithNumber);
		} else {

			if (initialHadithBook !== hadithBook || initialHadithNumber !== hadithNumber) {
				getNewHadith();
			}
		}
		setHadithOptionsVisibility(!hadithOptionsVisibility);
	};

	const getNewHadith = () => {
		setHadithInfoLoading2(true);
		getHadith(hadithBook, hadithNumber)
			.then((data) => {
				setHadith(data);
				setHadithBook(data.bookNameID);
				setHadithNumber(data.id);
				setError(null); 
				setHadithInfoLoading2(false);
			})
			.catch(() => {
				setError('Error fetching hadith. Please try again.');
				setHadithInfoLoading2(false);
			});
	};

	const getNewRandomHadith = () => {
		setHadithInfoLoading2(true);
		getHadith()
			.then((data) => {
				setHadith(data);
				setHadithBook(data.bookNameID);
				setHadithNumber(data.id);
				setError(null); 
				setHadithInfoLoading2(false);
			})
			.catch(() => {
				setError('Error fetching random hadith. Please try again.');
				setHadithInfoLoading2(false);
			});
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		setCity(city.trim());
		setCountry(country.trim());
		setSubmitted(true);
		setPrayerTimeInfoLoading(true);
		setHadithInfoLoading(true);
		setData(null);
		setIsValidLocation(true);
		setTipModalVisibility(false);
		setLocationFormVisibility(false);
		setError(null);

		getLatLon(city, country)
			.then((response) => {
				if (response) {
					setCity(response.city);
					setCountry(response.country);
					setDisplayCity(response.city);
					setDisplayCountry(response.country);
					getTimeZoneFromLatLon(response.lat, response.lon)
						.then((timeZoneData) => {
							setTimeZone(timeZoneData);
							const momentDate = moment.tz(timeZone).toDate().toLocaleString();
							const [month, day, year] = momentDate.split('/');
							getPrayerTimes(city, country, response.lat, response.lon, day, month, year.slice(0, 4))
								.then((prayerTimesResponse) => {
									setData(prayerTimesResponse);
									document.title = `${city}, ${country} | ${prayerTimesResponse.date.gregorian.day} ${prayerTimesResponse.date.gregorian.month} ${prayerTimesResponse.date.gregorian.year}`;
									setPrayerTimeInfoLoading(false);
								})
								.catch(() => {
									setError('Error fetching prayer times. Please try again.');
									setLocationFormVisibility(true);
									setIsValidLocation(false);
									setPrayerTimeInfoLoading(false);
									setHadithInfoLoading(false);
								});
						})
						.catch(() => {
							setError('Error fetching time zone. Please try again.');
							setLocationFormVisibility(true);
							setIsValidLocation(false);
							setPrayerTimeInfoLoading(false);
							setHadithInfoLoading(false);
						});
				} else {
					setError(`${city}, ${country} is not a valid location`);
					setLocationFormVisibility(true);
					setIsValidLocation(false);
					setPrayerTimeInfoLoading(false);
					setHadithInfoLoading(false);
					document.title = 'Prayer Times';
				}
			})
			.catch(() => {
				setError('Error fetching location. Please try again.');
				setLocationFormVisibility(true);
				setIsValidLocation(false);
				setPrayerTimeInfoLoading(false);
				setHadithInfoLoading(false);
			});
		getHadith(hadithBook, hadithNumber)
			.then((response) => {
				setHadith(response);
				setHadithBook(response.bookNameID);
				setHadithNumber(response.id);
				setHadithInfoLoading(false);
			})
			.catch(() => {
				setError('Error fetching hadith. A new hadith will be displayed.');
				setHadithInfoLoading(false);
			});
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
					<GeolocationRequestButton onSubmit={handleSubmit} setCityFunc={setCity} setCountryFunc={setCountry} setDisplayCityFunc={setDisplayCity} setDisplayCountryFunc={setDisplayCountry} setErrorFunc={setError} isLoadingLocationVar={isLoadingLocation} setIsLoadingLocationFunc={setIsLoadingLocation}/>
				</div>
			)}
			{(!isValidLocation || error) && submitted && <p className='locationResult'>{error}</p>}
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
								<p className='date'>{data.date.gregorian.weekday} the {data.date.gregorian.day}, {data.date.gregorian.month} {data.date.gregorian.year}</p>
								<p className='date'>{data.date.hijri.weekday} the {data.date.hijri.day}, {data.date.hijri.month} {data.date.hijri.year}</p>
							</div>
							<PrayerTimings data={data} timeZone={timeZone} />
						</div>
					</div>
					<HadithCard hadithObject={hadith} onInfoClick={toggleHadithInfoVisibility} onRegenerateClick={getNewRandomHadith} onOptionsClick={toggleHadithOptionsVisibility} isLoading={hadithInfoLoading2} />
				</div>
			)}
			{data && isValidLocation && (
				<div className='tipDiv'>
					<p className='tip'>It's best to wait at least 5 minutes before praying.</p>
					<i className="fa-solid fa-circle-info" onClick={toggleModal}></i>
				</div>
			)}
			{tipModalVisibility && <TipModal onClose={toggleModal} />}
			{hadithInfoVisibility && <HadithInfo hadithObject={hadith} onClose={toggleHadithInfoVisibility} />}
			{hadithOptionsVisibility && <HadithOptionsModal setHadithBookFunc={setHadithBook} setHadithNumberFunc={setHadithNumber} currentHadithBook={hadithBook} currentHadithNumber={hadithNumber} onClose={toggleHadithOptionsVisibility} />}
		</div>
	);
}
