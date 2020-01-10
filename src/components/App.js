import React from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './Header';
import Background from './Background';

function App({match}) {
	return (
		<div className="App">
			<Header region={match.params.region} />
			<Background y={0}/>
			
		</div>
	);
}

export default App;
