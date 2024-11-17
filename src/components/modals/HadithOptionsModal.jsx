import React, { useState, useEffect } from 'react';
import '../../styles/hadithOptionsModal.css';

export default function HadithOptionsModal({ setHadithBookFunc, setHadithNumberFunc, currentHadithBook, currentHadithNumber, onClose }) {
	const [currentHadithNumbers, setCurrentHadithNumbers] = useState([]);

	const numberOfHadithsByBook = {
		'sahih-bukhari': 7563,
		'sahih-muslim': 3033,
		'abu-dawood': 5274,
		'ibn-e-majah': 4341,
		'al-tirmidhi': 3956
	};

	useEffect(() => {
		if (currentHadithBook) {
			const totalHadiths = numberOfHadithsByBook[currentHadithBook];
			const options = Array.from({ length: totalHadiths }, (_, index) => index + 1);
			setCurrentHadithNumbers(options);
		} else {
			setCurrentHadithNumbers([]);
		}
	}, [currentHadithBook]);

	const handleBookChange = ({ target }) => {
		setHadithBookFunc(target.value);
		setHadithNumberFunc(null);
	}

	const handleNumberChange = ({ target }) => {
		if (target.value) {
			setHadithNumberFunc(target.value);
		} else {
			setHadithNumberFunc(currentHadithNumber);
		}
	}

	return (
		<div className="tipModal hadithInfoModal">
			<div className="tipModal-content hadithInfoContent">
				<i className="fa-solid fa-circle-xmark" onClick={onClose}></i>
				<div className="tip hadithTip">
					<label htmlFor="books">Choose a book:</label>
					<select id="books" name="books" value={currentHadithBook} onChange={handleBookChange}>
						<option value={null}>Select a Book</option>
						<option value="sahih-bukhari">Sahih al-Bukhari</option>
						<option value="sahih-muslim">Sahih Muslim</option>
						<option value="abu-dawood">Abu Dawud</option>
						<option value="ibn-e-majah">Ibn Majah</option>
						<option value="al-tirmidhi">Al-Tirmidhi</option>
					</select>
				</div>
				<div className="tip hadithTip">
					<label htmlFor="numbers">Choose a hadith number:</label>
					<select id="numbers" name="numbers" value={currentHadithNumber || ""} onChange={handleNumberChange}>
						<option value={1}>Select a Number</option>
						{currentHadithNumbers.map(number => (
							<option key={number} value={number}>{number}</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
