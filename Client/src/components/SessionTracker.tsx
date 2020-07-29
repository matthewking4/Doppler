import React from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Chart from 'react-google-charts';

type LiveSessionState = {
    loading: boolean;
    error: boolean;
    activeSessionId: string | null;
    assetData: any;
    // options: any;
    // series: any;
};
const data = [
    ['Year', 'Sales', 'Expenses'],
    ['2004', 1000, 400],
    ['2005', 1170, 460],
    ['2006', 660, 1120],
    ['2007', 1030, 540],
];
const options = {
    title: 'Company Performance',
    curveType: 'function',
    legend: { position: 'bottom' },
};

class LiveSessionTracker extends React.Component<any, LiveSessionState> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeSessionId: this.props.match.params || null,
            assetData: {},
            error: false,
            loading: true,
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ activeSessionId: id });

        fetch(`http://localhost:443/session/${id}`).then((response) => response.json()).then((response) => this.setState({ assetData: response, loading: false }))
        setInterval(() => {
            this.updateSessionData();
        }, 2000);
    }

    updateSessionData() {
        fetch(`http://localhost:443/session/${this.state.activeSessionId}`).then((response) => response.json()).then((response) => this.setState({ assetData: response, loading: false }))
    }


    adaptThrottleData(assetData: any) {
        let adaptedAssetData = [['Position', 'bitrate']];
        assetData.sessionData.map((data: any) => adaptedAssetData.push([data.position, data.bitrate.bitrateKbps]));
        console.log(assetData);
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
                            <div className="App">
                                <Chart
                                    chartType="AreaChart"
                                    width="91%"
                                    height="400px"
                                    data={this.adaptThrottleData(this.state.assetData)}
                                    options={{
                                        title: 'Player Profiler',
                                        vAxis: { title: 'Current Bandwith (KBPS)' },
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
                                                    max: '',
                                                },
                                                textPosition: 'none',
                                                gridlines: {
                                                    color: 'transparent',
                                                },
                                                baseline: 1,
                                                baselineColor: 'transparent',
                                            },
                                            1: {
                                                viewWindow: {
                                                    min: 0,
                                                    max: '',
                                                },
                                                textPosition: 'none',
                                                gridlines: {
                                                    color: 'transparent',
                                                },
                                                baseline: 1,
                                                baselineColor: 'transparent',
                                            },
                                        },
                                        pointSize: 5,
                                        hAxis: {
                                            title: 'Position in Stream',
                                            viewWindow: {
                                                min: 0,
                                                max: '',
                                            },
                                            textPosition: 'none',
                                            gridlines: {
                                                color: 'transparent',
                                            },
                                            baseline: 1,
                                            baselineColor: 'transparent',
                                        },
                                        series: {
                                            // 0: {
                                            //     color: '#25F5AB',
                                            //     targetAxisIndex: 1,
                                            // },
                                            // 1: {
                                            //     color: '#F4FF00',
                                            //     targetAxisIndex: 1,
                                            // },
                                        },
                                        chartArea: {
                                            left: 80,
                                            top: 30,
                                            width: '100%',
                                            height: '70%',
                                        },
                                        tooltip: { isHtml: true },
                                    }}
                                    legendToggle
                                />                    
                            </div>
                        )}
            </div>
        );
    }
}

export const SessionTracker = withRouter(LiveSessionTracker);
