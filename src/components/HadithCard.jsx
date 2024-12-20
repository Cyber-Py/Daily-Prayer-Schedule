import React from 'react';
import '../styles/hadithCard.css'

export default function HadithCard({ hadithObject, onRegenerateClick, onInfoClick, onOptionsClick, isLoading }) {
	if (isLoading) {
		return (
			<div className="hadithInfo">
				<div className="hadithContent">
					<h1>Hadith:</h1>
					<i className="fa-solid fa-arrows-rotate rotating"></i>
				</div>
			</div>
		);
	}
	return (
		<div className="hadithInfo">
			<div className="hadithContent">
				<h1>Hadith:</h1>
				<p>{hadithObject.header}{hadithObject.hadith_english}</p>
			</div>
			<div>
				<i className="fa-solid fa-arrows-rotate not-rotating" onClick={onRegenerateClick}></i>
				<i className="fa-solid fa-circle-info" onClick={onInfoClick}></i>
				<i className="fa-solid fa-sliders" onClick={onOptionsClick}></i>
			</div>
		</div>
	);
}
