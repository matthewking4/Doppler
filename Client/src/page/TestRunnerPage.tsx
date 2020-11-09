import React from 'react';
import { DropdownButton, Dropdown, Spinner } from 'react-bootstrap';
import Chart from 'react-google-charts';
import { TestRunner } from '../components/TestRunner';
import { ThrottleManager } from '../throttle-manager';

export class TestRunnerPage extends React.Component<any, any> {

    constructor(props: any) {
        // this.ThrottleManager = null;
        super(props);
        this.state = {
            throttlingProfiles: [],
            loading: false,
            selectedThrottleProfile: {},
            shouldSave: false,
            serverAdd: '',
            serverPort: '',
            start: false,
            throttleManager: null,
        };
    }

    componentDidMount() {
        fetch('http://localhost:8443/network/profiles')
            .then((response) => response.json())
            .then((response) => {
                this.setState({ loading: false, throttlingProfiles: response });
            });
    }

    componentDidUpdate() {
        if (
            this.state.start &&
            this.state.serverAdd &&
            this.state.serverPort &&
            this.state.accountId &&
            this.state.throttleManager === null &&
            this.state.selectedThrottleProfile !== {}
        ) {
            const { accountId, serverPort, serverAdd } = this.state;
            this.setState({
                throttleManager: new ThrottleManager(
                    { accountId, serverPort, serverAdd },
                    this.state.selectedThrottleProfile,
                ),
            });
        }
    }

    selectProfile(profile: any) {
        this.setState({ selectedThrottleProfile: profile });
    }

    createProfileOptions() {
        return {
            title: 'Throttle Profile',
            vAxis: { title: 'Avalibale Bandwith (KBPS)' },
            hAxis: { title: 'Duration (Mins)' },
        };
    }

    adaptThrottleData(throttleData: any) {
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

    renderTestingProfiles() {
        return (
            <DropdownButton id="dropdown-basic-button" title="Throttle Profiles">
                <Dropdown.Item onClick={() => this.selectProfile({})}>Create a new throttling Profile</Dropdown.Item>
                <Dropdown.Divider />
                {this.state.throttlingProfiles.map((profile: any) => (
                    <Dropdown.Item onClick={() => this.selectProfile(profile)}>{profile.title}</Dropdown.Item>
                ))}
            </DropdownButton>
        );
    }

    render() {
        return this.state.loading ? (
            <Spinner animation="grow" />
        ) : (
            <div>
                <div className="Side-bar">
                    <hr/>
                    <p>
                        {' '}
                        {this.state.selectedThrottleProfile.title
                            ? this.state.selectedThrottleProfile.title
                            : 'Please Select A Profile'}{' '}
                    </p>
                    {this.renderTestingProfiles()}
                    <br />
                    <p> Throttle Server Address </p>
                    <input placeholder={'192.168.0.1'} onChange={(e) => this.setState({ serverAdd: e.target.value })} />
                    <p> Throttle Server Port</p>
                    <input placeholder={'1080'} onChange={(e) => this.setState({ serverPort: e.target.value })} />

                    <p>Profile ID</p>
                    <input
                        placeholder={'john.doe@sky.uk'}
                        onChange={(e) => this.setState({ accountId: e.target.value })}
                    />
                    {this.state.accountId && this.state.serverAdd && this.state.serverPort && (
                        <button className="btn-primary" onClick={() => this.setState({ start: true })}>
                            Start
                        </button>
                    )}
                    {this.state.start && (
                        <button className="btn-primary" onClick={() => this.setState({ shouldSave: true })}>
                            {' '}
                            Stop{' '}
                        </button>
                    )}
                </div>
                <div className="Main-content">
                    {this.state.selectedThrottleProfile.title && (
                        <React.Fragment>
                            <h1 style={{width: '100%', textAlign: 'center', color: 'white'}}> Selected Profile</h1>
                        <Chart
                            chartType="AreaChart"
                            width="99%"
                            height="230px"
                            data={this.adaptThrottleData(this.state.selectedThrottleProfile.data)}
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
                                        max: '',
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
                    </React.Fragment>
                    )}

                    {this.state.start && (
                        <div style={{ position: 'relative' }}>
                            <h1 style={{width: '100%', textAlign: 'center', color: 'white'}}> Active Session</h1>
                            <TestRunner
                                throttleManager={this.state.throttleManager}
                                activeSessionId={this.state.accountId}
                                networkProfile={this.state.selectedThrottleProfile}
                                shouldSave={this.state.shouldSave}
                            />
                        </div>
                    )}
                </div>

                {/* <Chart
                                chartType="AreaChart"
                                width="99%"
                                height="400px"
                                style={{ position: 'absolute' }}
                                data={this.adaptThrottleData(this.state.selectedThrottleProfile.data)}
                                options={{
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
                                                max: this.state.maxBitrate,
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
                                                max: this.state.maxBitrate,
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
                                        0: {
                                            color: '#25F5AB',
                                            // targetAxisIndex: 1,
                                        },
                                        1: {
                                            color: '#F4FF00',
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
                            /> */}
                {/* 
                {this.state.selectedThrottleProfile.title && (
                    <div>
                       
                        
                            <h5>Profile ID:</h5>
                            <input
                                placeholder={'matthew.king4@sky.uk'}
                                onChange={(e) => this.setState({ accountId: e.target.value })}
                            />
                            <button onClick={() => this.setState({ start: true })}> Start </button>
                            <button onClick={() => this.setState({ shouldSave: true })}> Save </button>
                        </div>
                        {this.state.start && (
                            <div style={{ position: 'relative' }}>
                                <Chart
                                    chartType="AreaChart"
                                    width="99%"
                                    height="400px"
                                    style={{ position: 'absolute' }}
                                    data={this.adaptThrottleData(this.state.selectedThrottleProfile.data)}
                                    options={{
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
                                                    max: this.state.maxBitrate,
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
                                                    max: this.state.maxBitrate,
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
                                            0: {
                                                color: '#25F5AB',
                                                // targetAxisIndex: 1,
                                            },
                                            1: {
                                                color: '#F4FF00',
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
                                />
                                <SessionTracker
                                    throttleManager={this.state.throttleManager}
                                    setMaxBitrate={this.setMaxBitrate}
                                    activeSessionId={this.state.accountId}
                                    networkProfile={this.state.selectedThrottleProfile}
                                    shouldSave={this.state.shouldSave}
                                />
                            </div>
                        )}
                    </div>
                )} */}
            </div>
        );
    }
}
