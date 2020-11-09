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
    maxBitrate: any;
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
            maxBitrate: '',
        };
    }

    componentDidMount() {
        const data = this.props.networkProfile?.data;
        const id = this.props.match.params.id || this.props.activeSessionId;
        this.setState({ activeSessionId: id, endOfProfileInSec: data ? data[data.length - 1].position * 60 : null });
        fetch(`http://localhost:8443/session/${id}`)
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
        fetch(`http://localhost:8443/session/${this.state.activeSessionId}`)
            .then((response) => response.json())
            .then((response) => this.setState({ assetData: response, loading: false }))
            .catch(() => this.setState({ loading: false }));
    }

    componentWillUpdate() {
        this.props.shouldSave && this.saveResults();
    }

    formatTime(totalSeconds: number) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
        const seconds = Math.floor(totalSeconds) % 60;

        const twoDigitSeconds = `0${seconds}`.substr(-2);
        const twoDigitMinutes = `0${minutes}`.substr(-2);

        return hours ? `${hours}:${twoDigitMinutes}:${twoDigitSeconds}` : `${minutes}:${twoDigitSeconds}`;
    };

    adaptThrottleData(assetData: any) {
        let adaptedAssetData = [['Position', 'bitrate', { role: 'tooltip', type: 'string' }]] as any;
        const maxBitrate =
            assetData.sessionData &&
            Math.max(
                ...assetData.sessionData.map((data: any) => {
                    const bitrate = data.bitrate?.bitrateKbps
                    const playerState = data.playerState
                    if (playerState === 'PlayerLoading') return
                    adaptedAssetData.push([data?.position / 60, bitrate, `Position: ${this.formatTime(data?.position)}\nBitrate: ${bitrate}\nState: ${playerState}`]);
                    return data.bitrate?.bitrateKbps;
                }),
                0,
            );
        console.log("this.props.throttleManager", this.props.throttleManager)
        // this.props.throttleManager &&  this.props.throttleManager.updateThrottleProxy(assetData.sessionData);
        this.props.setMaxBitrate && maxBitrate && this.setMaxBitrate(maxBitrate)
        return adaptedAssetData;
    }


    setMaxBitrate(kbps: number) {
        kbps += kbps * 0.20;
        if (this.state.maxBitrate !== kbps) {
            this.props.setMaxBitrate(kbps)
            this.setState({ maxBitrate: kbps })
        }
    }

    saveResults = () => {
        fetch(`http://localhost:8443/session/id=${this.state.activeSessionId}/save=true`, {
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
                                    maxBitrate={this.state.maxBitrate}
                                />
                            </div>
                        )}
            </div>
        );
    }
}

export const SessionTracker = withRouter(LiveSessionTracker);
