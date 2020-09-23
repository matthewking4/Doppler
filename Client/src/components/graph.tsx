import Chart from 'react-google-charts';
import React from 'react';

type GraphProps = {
    title: string;
    vTitle: string;
    hTitle: string;
    data: Array<any>;
};

export class Graph extends React.Component<GraphProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: false,
        };
    }

    componentDidUpdate(prevProps: GraphProps, prevState: any) {
        if (this.props.data.length > 1 && this.state.error) {
            this.setState({ error: false });
        }
    }

    render() {
        const { title, vTitle, hTitle, data } = this.props;
        return (
            <div>
                {this.state.error ? (
                    <h1>No data found. Please start your playback session </h1>
                ) : (
                    <div className="App">
                        <Chart
                            chartType="AreaChart"
                            width="91%"
                            height="400px"
                            data={data}
                            options={{
                                title: title,
                                vAxis: { title: vTitle },
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
                                    title: hTitle,
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
                            chartEvents={[
                                {
                                    eventName: 'error',
                                    callback: () => this.setState({ error: true }),
                                },
                                // {
                                //     eventName: 'statechange',
                                //     callback: () => console.log("....statechange"),
                                // },
                                // {
                                //     eventName: 'ok',
                                //     callback: () => console.log("....ok"),

                                // },
                                // {
                                //     eventName: 'ready',
                                //     callback: () => console.log("....ready"),

                                // },
                                // {
                                //     eventName: 'select',
                                //     callback: () => console.log("....select"),

                                // }
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
