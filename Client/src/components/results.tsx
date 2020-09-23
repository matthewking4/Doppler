import React from 'react';
import { Spinner } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import { Graph } from './graph';

export class Results extends React.Component<any, any> {

    adaptThrottleData(assetData: any) {
        let adaptedAssetData = [['Position', 'bitrate']];
        assetData.sessionData &&
            assetData.sessionData.map((data: any) =>
                adaptedAssetData.push([data?.position / 60, data.bitrate?.bitrateKbps]),
            );
        return adaptedAssetData;
    }

    render() {
        return (
            <div>
                <Graph
                    data={this.adaptThrottleData(this.props.asset)}
                    title="Player Profiler"
                    vTitle="Current Bandwith (KBPS)"
                    hTitle="Position in Stream"
                />
            </div>
        );
    }
}

