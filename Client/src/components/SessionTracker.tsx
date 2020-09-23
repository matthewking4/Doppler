import React from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Graph } from './graph';

type LiveSessionState = {
    loading: boolean;
    error: boolean;
    activeSessionId: string | null;
    assetData: any;
    // options: any;
    // series: any;
};

class LiveSessionTracker extends React.Component<any, LiveSessionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeSessionId: this.props.match.params || this.props.activeSessionId || null,
            assetData: {},
            error: false,
            loading: true,
        };
    }

    componentDidMount() {
        const id = this.props.match.params.id || this.props.activeSessionId;
        this.setState({ activeSessionId: id });
        fetch(`http://localhost:443/session/${id}`)
            .then((response) => response.json())
            .then((response) => this.setState({ assetData: response, loading: false }))
            .catch(() => this.setState({ loading: false }));
        setInterval(() => {
            this.updateSessionData();
        }, 2000);
    }

    updateSessionData() {
        fetch(`http://localhost:443/session/${this.state.activeSessionId}`)
            .then((response) => response.json())
            .then((response) => this.setState({ assetData: response, loading: false }))
            .catch(() => this.setState({ loading: false }));
    }

    adaptThrottleData(assetData: any) {
        let adaptedAssetData = [['Position', 'bitrate']];
        assetData.sessionData &&
            assetData.sessionData.map((data: any) =>
                adaptedAssetData.push([data?.position, data.bitrate?.bitrateKbps]),
            );
        return adaptedAssetData;
    }

    render() {
        return (
            <div>
                {this.state.error ? (
                    <h1> No Live Asset Found </h1>
                ) : this.state.loading ? (
                    <Spinner animation="grow" />
                ) : (
                    <Graph
                        data={this.adaptThrottleData(this.state.assetData)}
                        title="Player Profiler"
                        vTitle="Current Bandwith (KBPS)"
                        hTitle="Position in Stream"
                    />
                )}
            </div>
        );
    }
}

export const SessionTracker = withRouter(LiveSessionTracker);
