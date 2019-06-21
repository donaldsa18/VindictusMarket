import React from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './Header';
function PriceTracker({match}) {
	return (
		<div className="App">
			<Header region={match.params.region} />
			<header className="App-header">
			
			</header>
		</div>
	);
}

export default PriceTracker;