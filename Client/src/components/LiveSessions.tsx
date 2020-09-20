import React from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';

type LiveSessionState = { activeSessions: any; loading: boolean; selectedSessionId: string | null };

export class LiveSessions extends React.Component<any, LiveSessionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeSessions: [],
            loading: true,
            selectedSessionId: null,
        };
    }

    componentDidMount() {
        fetch('http://localhost:443/session/active')
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
                this.setState({ loading: false, activeSessions: response });
            });
    }

    render() {
        console.log(this.state);
        return this.state.loading ? (
            <Spinner animation="grow" />
        ) : (
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Account ID</th>
                            <th>Asset</th>
                            <th>Device</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.activeSessions.map((asset: any) => (
                            <tr onClick={() => this.setState({ selectedSessionId: asset?.accountId })}>
                                <td>{asset?.accountId}</td>
                                <td>{asset?.assetName}</td>
                                <td>{asset?.deviceId}</td>
                                <td>{asset?.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                {this.state.selectedSessionId ? <Redirect to={`live/${this.state.selectedSessionId}`} /> : null}
            </div>
        );
    }
}
