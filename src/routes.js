import React from 'react';
import {Route,BrowserRouter as Router,Redirect} from 'react-router-dom';

import App from './components/App';
import PriceTracker from './components/PriceTracker';
import LocationTracker from './components/LocationTracker';
import ActiveSoaps from './components/ActiveSoaps';
import OutfitDatabase from './components/OutfitDatabase';
import ItemDatabase from './components/ItemDatabase';

function getRoutes() {
    return (
        <Router>
            <div>
                <Route path="/:region(na|eu)/prices/:item?" component={PriceTracker}/>
                <Route path="/:region(na|eu)/locations/:town(colhen|rocheste|malina|berbhe)?" component={LocationTracker}/>
                <Route path="/:region(na|eu)/soaps" component={ActiveSoaps}/>
                <Route path="/:region(na|eu)/outfits/:charactername?" component={OutfitDatabase}/>
                <Route path="/:region(na|eu)/items/:itemname?" component={ItemDatabase}/>
                <Route exact path="/:region(na|eu)" component={App}/>
                <Route exact path="/" render={()=><Redirect to="/na" />}/>
            </div>
        </Router>
    );

}
export default getRoutes();