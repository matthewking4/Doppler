import React from 'react';
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Graph } from './graph';

type LiveSessionState = {
    loading: boolean;
    error: boolean;
    activeSessionId: string | null;
    assetData: any;
    shouldEnd: boolean;
    endOfProfileInSec: any;
    // options: any;
    // series: any;
};

class LiveSessionTracker extends React.Component<any, LiveSessionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeSessionId: this.props.match.params || this.props.activeSessionId || null,
            endOfProfileInSec: null,
            shouldEnd: false,
            assetData: {},
            error: false,
            loading: true,
        };
    }

    componentDidMount() {
        const data = this.props.networkProfile?.data;
        const id = this.props.match.params.id || this.props.activeSessionId;
        this.setState({ activeSessionId: id, endOfProfileInSec: data ? data[data.length - 1].position * 60 : null });
        fetch(`http://localhost:443/session/${id}`)
            .then((response) => response.json())
            .then((response) => this.setState({ assetData: response, loading: false }))
            .catch(() => this.setState({ loading: false }));
        setInterval(() => {
            this.updateSessionData();
        }, 2000);
    }

    updateSessionData() {
        if (this.state.endOfProfileInSec && this.state.assetData) {
            const lastPosition =
                this.state.assetData.sessionData &&
                this.state.assetData.sessionData[this.state.assetData.sessionData.length - 1].position;
            lastPosition >= this.state.endOfProfileInSec && this.setState({ shouldEnd: true });
        }
        fetch(`http://localhost:443/session/${this.state.activeSessionId}`)
            .then((response) => response.json())
            .then((response) => this.setState({ assetData: response, loading: false }))
            .catch(() => this.setState({ loading: false }));
    }

    componentWillUpdate() {
        this.props.shouldSave && this.saveResults();
    }

    adaptThrottleData(assetData: any) {
        let adaptedAssetData = [['Position', 'bitrate']];
        assetData.sessionData &&
            assetData.sessionData.map((data: any) =>
                adaptedAssetData.push([data?.position / 60, data.bitrate?.bitrateKbps]),
            );
        return adaptedAssetData;
    }

    saveResults = () => {
        fetch(`http://localhost:443/session/id=${this.state.activeSessionId}/save=true`, {
            method: 'DELETE',
        });
    };

    render() {
        return (
            <div>
                {this.state.error ? (
                    <h1> No Live Asset Found </h1>
                ) : this.state.loading ? (
                    <Spinner animation="grow" />
                ) : (
                    <div>
                        {this.state.shouldEnd && (
                            <div>
                                <h1>Your network profile has come to an end. Do you wish to save your results?</h1>
                                <button onClick={this.saveResults}> Save </button>
                            </div>
                        )}
                        <Graph
                            data={this.adaptThrottleData(this.state.assetData)}
                            title="Player Profiler"
                            vTitle="Current Bandwith (KBPS)"
                            hTitle="Position in Stream"
                            maxTimespan={this.state.endOfProfileInSec / 60}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export const SessionTracker = withRouter(LiveSessionTracker);
