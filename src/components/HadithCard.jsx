import React from 'react';

export default function HadithCard({ hadithObject, onRegenerateClick, onInfoClick, isLoading }) {
	if (isLoading) {
		return (
			<div className="hadithInfo">
				<div className="hadithContent">
					<h1>Hadith:</h1>
					<i class="fa-solid fa-arrows-rotate rotating"></i>
				</div>
			</div>
		);
	}
	return (
		<div className="hadithInfo">
			<div className="hadithContent">
				<h1>Hadith:</h1>
				<p>{hadithObject.header ? hadithObject.header + ' ' : ''}{hadithObject.hadith_english}</p>
			</div>
			<div>
				<i class="fa-solid fa-arrows-rotate" onClick={onRegenerateClick}></i>
				<i className="fa-solid fa-circle-info" onClick={onInfoClick}></i>
			</div>
		</div>
	);
}
