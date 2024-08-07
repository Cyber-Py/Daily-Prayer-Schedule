import React from 'react';

export default function TipModal({ onClose }) {
	return (
		<div className="tipModal">
			<div className="tipModal-content">
				<i class="fa-solid fa-circle-xmark" onClick={onClose}></i>
				<p>It's recommended to wait at few minutes before starting to pray. This is because prayer times are calculated based on astronomical calculations and local horizon conditions, which can vary slightly. Waiting ensures that you are offering your prayers at the correct time according to your location and local conditions.</p>
			</div>
		</div>
	);
}