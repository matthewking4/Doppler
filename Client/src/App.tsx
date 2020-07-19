import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Route } from 'react-router-dom';
import { Navbar, Nav, Jumbotron } from 'react-bootstrap';
import { LiveSessions } from './components/LiveSessions';
import { SessionTracker } from './components/SessionTracker';
import { TestRunnerPage } from './TestRunnerPage';
import './App.css';

const NavBar = (
    <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Doppler</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <Nav.Link href="/test">New Device Test</Nav.Link>
                <Nav.Link href="/live">Live Sessions</Nav.Link>
                <Nav.Link href="/results">Saved Results</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="/info">Info</Nav.Link>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export class Doppler extends React.Component {
    render() {
        return (
            <BrowserRouter>
                {NavBar}
                <Route path="/" exact>
                    <Jumbotron>
                        <h1>Welcome!</h1>
                        <p>
                            This is a simple hero unit, a simple jumbotron-style component for calling extra attention
                            to featured content or information.
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
                    <h1>results</h1>
                </Route>
            </BrowserRouter>
        );
    }
}
