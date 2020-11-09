import React from 'react';
import { BrowserRouter, Switch, NavLink, Route } from 'react-router-dom';
import { Navbar, Nav, Jumbotron } from 'react-bootstrap';
import { LiveSessions } from './page/LiveSessions';
import { SessionTracker } from './components/SessionTracker';
import { TestRunnerPage } from './page/TestRunnerPage';
import './App.css';
import { SavedResults } from './page/savedResultsPage';

const NavBar = (
    <Navbar className="Nav-bar" expand="lg">
        <Navbar.Brand
            style={{ color: 'white !important', paddingLeft: '4.5%', paddingRight: '4.5%', fontWeight: 'bold' }}
            href="/"
        >
            Doppler
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link>
                    <NavLink to="/test">Test a Device</NavLink>
                </Nav.Link>
                <Nav.Link>
                    <NavLink to="/live">Live Sessions</NavLink>
                </Nav.Link>
                <Nav.Link>
                    <NavLink to="/results">Saved Results</NavLink>
                </Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link>
                    <NavLink to="/info">Information</NavLink>
                </Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export class Doppler extends React.Component {
    render() {
        return (
            <BrowserRouter>
                {NavBar}
                <Switch>
                    <Route path="/" exact>
                        <Jumbotron>
                            <h1>Welcome!</h1>
                            <p>
                                This is a simple hero unit, a simple jumbotron-style component for calling extra
                                attention to featured content or information.
                            </p>
                        </Jumbotron>
                    </Route>
                    <Route path="/test">
                        <TestRunnerPage />
                    </Route>
                    <Route path="/live" exact>
                        <LiveSessions />
                    </Route>
                    <Route path="/live/:id">
                        <SessionTracker />
                    </Route>
                    <Route path="/results">
                        <SavedResults />
                    </Route>
                </Switch>
            </BrowserRouter>
        );
    }
}
