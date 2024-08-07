import './styles/App.css'
import './styles/loadingAnimation.css'
import './styles/hadithCard.css'
import './styles/modal.css'
import './styles/hadithOptionsModal.css'
import PrayerTimes from './PrayerTimes'
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function App() {
	return (
	<>
		<PrayerTimes />
		<SpeedInsights />
	</>
	)
}
