import Chart from 'react-google-charts';
import React from 'react';

type GraphProps = {
    title: string;
    vTitle: string;
    hTitle: string;
    data: Array<any>;
    maxTimespan?: number | null,
    maxBitrate?: any | null,
};

export class Graph extends React.Component<GraphProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: false,
        };
    }

    componentDidUpdate() {
        if (this.props.data.length > 1 && this.state.error) {
            this.setState({ error: false });
        }
    }

    render() {
        const { title, vTitle, hTitle, data, maxTimespan, maxBitrate } = this.props;
        return (
            <div>
                {this.state.error ? (
                    <h1>No data found. Please start your playback session </h1>
                ) : (
                    <div className="App">
                        <Chart
                            chartType="AreaChart"
                            width="99%"
                            height="400px"
                            style={{position: 'absolute'}}
                            data={data}
                            options={{
                                // title: title,
                                // vAxis: { title: vTitle },
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
                                            max: maxBitrate,
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
                                    // title: hTitle,
                                    viewWindow: {
                                        min: 0,
                                        max: maxTimespan || '',
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
                                        targetAxisIndex: 1
                                    },
                                    1: {
                                        color: '#F4FF00',
                                        targetAxisIndex: 1
                                    }
                                },
                                chartArea: {
                                    left: 80,
                                    top: 30,
                                    width: '92%',
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
                    </div>
                )}
            </div>
        );
    }
}

// chartEvents={[
//     {
//       eventName: "error",
//       callback: () => {
//         this.setState({error: true})
//     //   callback: ({ chartWrapper, google }) => {
//         // console.log("Selected ",chart.getSelection());
//         // google.visualization.events.addListener(chart, "onmouseover", e => {
//         //   const { row, column } = e;
//         //   console.warn("MOUSE OVER ", { row, column });
//         // });
//         // google.visualization.events.addListener(chart, "onmouseout", e => {
//         //   const { row, column } = e;
//         //   console.warn("MOUSE OUT ", { row, column });
//         // });
//       }
//     }
//   ]}
