import React from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { Results } from '../components/results';

export class ResultsPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            results: [],
            loading: true,
            selectedAsset: null,
        };
    }

    componentDidMount() {
        fetch('http://localhost:8443/session/results')
            .then((response) => response.json())
            .then((response) => {
                this.setState({ loading: false, results: response });
            });
    }

    render() {
        return this.state.loading ? (
            <Spinner animation="grow" />
        ) : (
                <div>
                    {!this.state.selectedAsset ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Asset</th>
                                    <th>Player</th>
                                    <th>Device</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.results.map((asset: any) => (
                                    <tr onClick={() => this.setState({ selectedAsset: asset })}>
                                        <td>{asset?.email}</td>
                                        <td>{asset?.assetName}</td>
                                        <td>{asset?.playerName}</td>
                                        <td>{asset?.deviceName}</td>
                                        <td>{asset?.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                            <Results asset={this.state.selectedAsset} />
                        )}
                </div>
            );
    }
}
