import React from 'react';
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Graph } from './graph';
import Chart from 'react-google-charts';

type TestRunner = {
    loading: boolean;
    error: boolean;
    activeSessionId: string | null;
    assetData: any;
    shouldEnd: boolean;
    endOfProfileInSec: any;
    maxBitrate: any;
    // options: any;
    // series: any;
};

class TestRunnerComponent extends React.Component<any, TestRunner> {
    private sessionPoll: any;
    constructor(props: any) {
        super(props);
        this.sessionPoll = null;
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

    async componentWillUnmount() {
        clearInterval(this.sessionPoll);
        this.props.throttleManager && this.props.throttleManager.resetThrottleProxy();
        await fetch(`http://localhost:8443/session/id=${this.state.activeSessionId}/save=false`, {
            method: 'DELETE',
        });
    }

    componentDidMount() {
        const data = this.props.networkProfile?.data;
        const id = this.props.match.params.id || this.props.activeSessionId;
        this.setState({ activeSessionId: id, endOfProfileInSec: data ? data[data.length - 1].position * 60 : null });
        fetch(`http://localhost:8443/session/${id}`)
            .then((response) => response.json())
            .then((response) => this.setState({ assetData: response, loading: false }))
            .catch(() => this.setState({ loading: false }));
        this.sessionPoll = setInterval(() => {
            this.updateSessionData();
        }, 2000);
    }

    updateSessionData() {
        if (this.state.endOfProfileInSec && this.state.assetData) {
            const lastPosition =
                this.state.assetData.sessionData &&
                this.state.assetData.sessionData[this.state.assetData.sessionData.length - 1].position;
            lastPosition >= this.state.endOfProfileInSec &&
                this.setState({ shouldEnd: true }) &&
                this.props.throttleManager.resetThrottleProxy() &&
                clearInterval(this.sessionPoll);
        }
        fetch(`http://localhost:8443/session/${this.state.activeSessionId}`)
            .then((response) => response.json())
            .then((response) => this.setState({ assetData: response, loading: false }))
            .catch(() => this.setState({ loading: false }));
    }

    componentWillUpdate() {
        this.props.shouldSave && this.saveResults();
    }

    adaptProfileData(throttleData: any) {
        let adaptedThrottleData = [['Position', 'Bandwith', { role: 'tooltip', type: 'string', p: { html: true } }]];
        throttleData.map((data: any) =>
            adaptedThrottleData.push([
                data.position,
                data.bandwidth,
                `${data.position} minute <br/>${data.bandwidth} Kbps`,
            ]),
        );
        return adaptedThrottleData;
    }

    formatTime(totalSeconds: number) {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
        const seconds = Math.floor(totalSeconds) % 60;

        const twoDigitSeconds = `0${seconds}`.substr(-2);
        const twoDigitMinutes = `0${minutes}`.substr(-2);

        return hours ? `${hours}:${twoDigitMinutes}:${twoDigitSeconds}` : `${minutes}:${twoDigitSeconds}`;
    }

    adaptThrottleData(assetData: any) {
        let adaptedAssetData = [['Position', 'bitrate', { role: 'tooltip', type: 'string' }]] as any;
        assetData.sessionData &&
            assetData.sessionData.map((data: any) => {
                const bitrate = data.bitrate?.bitrateKbps;
                const playerState = data.playerState;
                adaptedAssetData.push([
                    data?.position / 60,
                    bitrate,
                    `Bitrate: ${bitrate}\nPosition: ${this.formatTime(data?.position)}\nState: ${playerState}`,
                ]);
            });
        this.props.throttleManager && this.props.throttleManager.updateThrottleProxy(assetData.sessionData);
        return adaptedAssetData;
    }

    getMaxBitrate() {
        return Math.max(
            this.state.assetData.sessionData &&
                Math.max(...this.state.assetData.sessionData.map((data: any) => data.bitrate?.bitrateKbps || 0), 0),
            Math.max(...this.props.networkProfile.data.map((data: any) => data.bandwidth || 0), 0),
        );
    }

    saveResults = () => {
        this.props.throttleManager.resetThrottleProxy();
        clearInterval(this.sessionPoll);
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
                                <h1 style={{ width: '100%', textAlign: 'center', color: 'white' }}>
                                    {' '}
                                    Your network profile has come to an end. Please save or stop your test run.
                                </h1>
                            </div>
                        )}
                        <Chart
                            chartType="AreaChart"
                            width="99%"
                            height="400px"
                            style={{ position: 'absolute' }}
                            data={this.adaptProfileData(this.props.networkProfile.data)}
                            options={{
                                interpolateNulls: true,
                                animation: {
                                    duration: 800,
                                    easing: 'out',
                                    startup: true,
                                },
                                curveType: 'none',
                                legend: {
                                    position: 'none',
                                },
                                backgroundColor: 'none',
                                vAxis: {
                                    viewWindow: {
                                        min: 0,
                                        max: this.getMaxBitrate(),
                                    },
                                    title: 'Rate (Kbps)',
                                    titleTextStyle: { color: '#2fc4e8' },
                                    gridlines: {
                                        color: '#444c57',
                                    },
                                    textStyle: {
                                        color: '#2fc4e8',
                                        fontName: 'helvetica',
                                        fontSize: 15,
                                    },
                                    baseline: 1,
                                    baselineColor: 'transparent',
                                    // textPosition: 'none',
                                },
                                pointSize: 5,
                                hAxis: {
                                    title: 'Stream Position (Mins)',
                                    titleTextStyle: { color: '#A2B5CB' },
                                    gridlines: {
                                        color: '#444c57',
                                        count: 5,
                                    },
                                    textStyle: {
                                        color: '#6d7b8b',
                                        fontName: 'helvetica',
                                        fontSize: 15,
                                    },
                                    viewWindow: {
                                        min: 0,
                                        max: '',
                                    },
                                    // textPosition: 'none',
                                },
                                series: {
                                    0: {
                                        color: '#2fc4e8',
                                    },
                                    1: {
                                        color: '#50e695',
                                    },
                                    2: {
                                        color: '#F601FF',
                                    },
                                },
                                chartArea: {
                                    left: 80,
                                    top: 30,
                                    width: '92%',
                                    height: '70%',
                                },
                                baseline: 1,
                                baselineColor: 'transparent',
                                tooltip: { isHtml: true },
                            }}
                            legendToggle
                        />
                        <Graph
                            data={this.adaptThrottleData(this.state.assetData)}
                            title="Player Profiler"
                            vTitle="Current Bandwith (KBPS)"
                            hTitle="Position in Stream"
                            maxTimespan={this.state.endOfProfileInSec / 60}
                            maxBitrate={this.getMaxBitrate()}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export const TestRunner = withRouter(TestRunnerComponent);

{
    /* <Chart
                            chartType="AreaChart"
                            width="99%"
                            height="400px"
                            style={{position: 'absolute'}}
                            data={this.adaptThrottleData(this.state.assetData)}
                            options={{
                                title: "Player Profiler",
                                vAxis: { title: "Current Bandwith (KBPS)" },
                                curveType: 'none',
                                legend: {
                                    position: 'none',
                                },
                                backgroundColor: 'none',
                                interpolateNulls: true,
                                vAxes: {
                                    0: {
                                        viewWindow: {
                                            min: 0,
                                            max: this.props.maxBitrate,
                                        },
                                        // textPosition: 'none',
                                        gridlines: {
                                            color: 'transparent',
                                        },
                                        baseline: 1,
                                        baselineColor: 'transparent',
                                    },
                                    1: {
                                        viewWindow: {
                                            min: 0,
                                            max: this.props.maxBitrate,
                                        },
                                        // textPosition: 'none',
                                        gridlines: {
                                            color: 'transparent',
                                        },
                                        baseline: 1,
                                        baselineColor: 'transparent',
                                    },
                                },
                                pointSize: 5,
                                hAxis: {
                                    title: "Position in Stream",
                                    viewWindow: {
                                        min: 0,
                                        max: this.state.endOfProfileInSec / 60 || '',
                                    },
                                    // textPosition: 'none',
                                    gridlines: {
                                        color: 'transparent',
                                    },
                                    baseline: 1,
                                    baselineColor: 'transparent',
                                },
                                series: {
                                    0: {
                                        color: '#6ADAEF',
                                        // targetAxisIndex: 1,
                                    },
                                    1: {
                                        color: '#28CAE7',
                                        targetAxisIndex: 1,
                                    },
                                },
                                chartArea: {
                                    left: 80,
                                    top: 30,
                                    width: '100%',
                                    height: '70%',
                                },
                                tooltip: { isHtml: true },
                            }}
                            chartEvents={[
                                {
                                    eventName: 'error',
                                    callback: () => this.setState({ error: true }),
                                },

                            ]}
                            legendToggle
                        /> */
}
