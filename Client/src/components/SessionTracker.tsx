import React from 'react';
import { Spinner, Table } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import Chart from 'react-google-charts';
// import ReactApexChart from 'react-apexcharts';
import Apex from 'apexcharts';

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
            // options: {
            //     chart: {
            //         id: 'chart',
            //         height: 350,
            //         type: 'line',
            //     },
            //     stroke: {
            //         width: [0, 4],
            //     },
            //     title: {
            //         text: 'Live Session Tracker',
            //     },
            //     dataLabels: {
            //         enabled: true,
            //         enabledOnSeries: [1],
            //     },
            //     labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001'],
            //     xaxis: {
            //         type: 'datetime',
            //     },
            //     yaxis: [
            //         {
            //             title: {
            //                 text: 'Website Blog',
            //             },
            //         },
            //         {
            //             opposite: true,
            //             title: {
            //                 text: 'Social Media',
            //             },
            //         },
            //     ],
            // },
            // series: [
            //     {
            //         name: 'Throttle Profile',
            //         type: 'column',
            //         data: [1, 2, 3],
            //     },
            //     {
            //         name: 'Session Data',
            //         type: 'line',
            //         data: [23, 42, 35],
            //     },
            // ],
            activeSessionId: this.props.match.params || null,
            assetData: {},
            error: false,
            loading: true,
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        this.setState({ activeSessionId: id });

        fetch(`http://localhost:443/session/${id}`)
            .then((response) => this.setState({ assetData: response.json(), loading: false }))
            .catch((e) => this.setState({ error: true }));

        ///Change this
        setInterval(() => {
            // Apex.exec('chart', 'updateOptions', {
            //     title: { text: `Tracking Live Session - Asset: ${this.state.activeSessionId} ` },
            // });
            this.updateSessionData();
            this.updateThrottleProfile();
        }, 8000);
    }

    updateSessionData() {
        // Use appendSerires
        // Apex.exec('chart', 'updateOptions', { labels: [...this.state.options.labels, '04 Jan 2001'] });
        // Apex.exec('chart', 'updateSeries', [
        //     this.state.series[0],
        //     {
        //         ...this.state.series[1],
        //         data: [...this.state.series[1].data, 42],
        //     },
        // ]);
    }

    updateThrottleProfile() {
        // Apex.exec('chart', 'updateSeries', [
        //     {
        //         ...this.state.series[0],
        //         data: [...this.state.series[0].data, 50],
        //     },
        //     this.state.series[1],
        // ]);
    }

    render() {
        return (
            <div>
                <h1> WIP: Come back to this page after device testing has been done</h1>
                <p>
                    {' '}
                    When a device is init, we should select device w throttle profile. save config to db and get active
                    sessions based of from deviceID
                </p>
                {this.state.error ? (
                    <h1> No Live Asset Found </h1>
                ) : this.state.loading ? (
                    <Spinner animation="grow" />
                ) : (
                    // <div id="chart">
                    //     <ReactApexChart
                    //         options={this.state.options}
                    //         series={this.state.series}
                    //         type="line"
                    //         height={350}
                    //     />
                    // </div>
                    <div className="App">
                        <Chart chartType="LineChart" width="100%" height="400px" data={data} options={options} />
                    </div>
                )}
            </div>
        );
    }
}

export const SessionTracker = withRouter(LiveSessionTracker);
