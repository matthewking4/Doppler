import React from 'react';
import { DropdownButton, Dropdown, Spinner } from 'react-bootstrap';
import Chart from 'react-google-charts';

export class TestRunnerPage extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            throttlingProfiles: [
                {
                    id: 0,
                    title: 'Some Profile',
                    data: [
                        { position: 0, bandwidth: 4000 },
                        { position: 60, bandwidth: 4000 },
                        { position: 60, bandwidth: 3000 },
                        { position: 120, bandwidth: 3000 },
                    ],
                },
                {
                    id: 1,
                    title: 'Some Profile 2',
                    data: [
                        { position: 0, bandwidth: 4000 },
                        { position: 60, bandwidth: 4000 },
                        { position: 60, bandwidth: 3000 },
                        { position: 120, bandwidth: 3000 },
                        { position: 120, bandwidth: 4000 },
                        { position: 180, bandwidth: 4000 },
                        { position: 180, bandwidth: 2000 },
                        { position: 200, bandwidth: 2000 },
                    ],
                },
            ],
            loading: false,
            selectedThrottleProfile: {},
        };
    }

    componentDidMount() {
        fetch('http://localhost:443/throttle/profiles')
            .then((response) => response.json())
            .then((response) => {
                console.log(response);
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
        let adaptedThrottleData = [['Position', 'Bandwith']];
        throttleData.map((data: any) => adaptedThrottleData.push([data.position, data.bandwidth]));
        console.log(throttleData);
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
                                width="91%"
                                height="400px"
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
                                        title: 'Duration (Mins)',
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
                            <h1> Throttle Server </h1>
                            <h5> Server address:</h5>
                            <input placeholder={'192.168.0.1'} onChangeCapture={event => console.log(event)} />
                            <h5>Port:</h5>
                            <input placeholder={'1080'} />
                            <h5>Profile ID:</h5>
                            <input placeholder={'matthew.king4@sky.uk'} />
                        </div>
                    )}
                </div>
            );
    }
}
