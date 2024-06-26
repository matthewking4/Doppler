import React from 'react';
import { DropdownButton, Dropdown, Spinner } from 'react-bootstrap';
import Chart from 'react-google-charts';
import { SessionTracker } from '../components/SessionTracker';

export class TestRunnerPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            throttlingProfiles: [],
            loading: false,
            selectedThrottleProfile: {},
            shouldSave: false,
        };
    }

    componentDidMount() {
        fetch('http://localhost:443/network/profiles')
            .then((response) => response.json())
            .then((response) => {
                this.setState({ loading: false, throttlingProfiles: response });
            });
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
                <h3>
                    {this.state.selectedThrottleProfile.title
                        ? this.state.selectedThrottleProfile.title
                        : 'Please Select A Profile'}
                </h3>
                {this.renderTestingProfiles()}
                {this.state.selectedThrottleProfile.title && (
                    <div>
                        <Chart
                            chartType="AreaChart"
                            width="99%"
                            height="230px"
                            data={this.adaptThrottleData(this.state.selectedThrottleProfile.data)}
                            options={{
                                title: 'Throttle Profile',
                                vAxis: { title: 'Avalibale Bandwith (KBPS)' },
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
                                    title: 'Duration (Mins)',
                                    viewWindow: {
                                        min: 0,
                                        max: '',
                                    },
                                    gridlines: {
                                        color: 'transparent',
                                    },
                                    baseline: 1,
                                    baselineColor: 'transparent',
                                },
                                series: {
                                    0: {
                                        color: '#25F5AB',
                                    },
                                    1: {
                                        color: '#F4FF00',
                                        targetAxisIndex: 1,
                                    },
                                },
                                chartArea: {
                                    left: '100',
                                    top: 30,
                                    width: '100%',
                                    height: '70%',
                                },
                                tooltip: { isHtml: true },
                            }}
                            legendToggle
                        />
                        <h1> Throttle Server </h1>
                        <h5> Server address:</h5>
                        <div style={{display: 'inline-flex'}}>
                            <input placeholder={'192.168.0.1'} onChangeCapture={(event) => console.log(event)} />
                            <h5>Port:</h5>
                            <input placeholder={'1080'} />
                            <h5>Profile ID:</h5>
                            <input
                                placeholder={'matthew.king4@sky.uk'}
                                onChange={(e) => this.setState({ accountId: e.target.value })}
                            />
                            <button onClick={() => this.setState({ start: true })}> Start </button>
                            <button onClick={() => this.setState({ shouldSave: true })}> Save </button>
                        </div>
                        {this.state.start && (
                                <SessionTracker
                                    activeSessionId={this.state.accountId}
                                    networkProfile={this.state.selectedThrottleProfile}
                                    shouldSave={this.state.shouldSave}
                                />
                            )}
                    </div>
                )}
            </div>
        );
    }
}
