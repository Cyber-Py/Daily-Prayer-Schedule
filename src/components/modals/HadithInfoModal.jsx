import React, { useState } from 'react';

export default function HadithInfo({ hadithObject, onClose }) {
	let horizontalLineVisibility = false;
	if (hadithObject.hadith_english_remaining) {
		horizontalLineVisibility = true
	}
	return (
		<div className="tipModal">
			<div className="tipModal-content">
				<i className="fa-solid fa-circle-xmark" onClick={onClose}></i>
				<p>{hadithObject.hadith_english_remaining}</p>
				{horizontalLineVisibility && <hr />}
				<p>Hadith Collection: {hadithObject.book}</p>
				<p>Book Name: {hadithObject.bookName}</p>
				<p>Hadith Number: {hadithObject.id}</p>
			</div>
		</div>
	);
}