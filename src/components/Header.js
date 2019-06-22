import React from 'react'
import {Nav,NavDropdown,Navbar} from 'react-bootstrap';

const Header = props => (
	<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
	<Navbar.Brand href="/">Vindictus Market</Navbar.Brand>
	<Navbar.Toggle aria-controls="responsive-navbar-nav" />
	<Navbar.Collapse id="responsive-navbar-nav">
	<Nav className="mr-auto">
	<NavDropdown title={props.region.toUpperCase()} id="collasible-nav-dropdown">
	<NavDropdown.Item href="/na">NA</NavDropdown.Item>
	<NavDropdown.Item href="/eu">EU</NavDropdown.Item>
	</NavDropdown>
	<Nav.Link href={`/${props.region}/prices`}>Price Tracker</Nav.Link>
	<Nav.Link href={`/${props.region}/locations`}>Location Tracker</Nav.Link>
	<Nav.Link href={`/${props.region}/soaps`}>Active Soaps</Nav.Link>
	<Nav.Link href={`/${props.region}/outfits`}>Outfit Database</Nav.Link>
	<Nav.Link href={`/${props.region}/items`}>Item Database</Nav.Link>
	</Nav>
	</Navbar.Collapse>
	</Navbar>
)
export default Header
