export class ThrottleManager {
    private throttleProfile = null as any;
    private config: any;
    private currentBandwidth = 0;

    constructor(config: any, throttleProfile: any) {
        this.config = config;
        this.prepThrottleProxy(throttleProfile);
    }

    public prepThrottleProxy(profile: any) {
        let previousSettings = {} as any;
        console.log(profile)
        this.throttleProfile = profile.data.map((data: any) => {
            if (data.bandwidth === previousSettings.bandwidth) {
                return {
                    start: previousSettings.position,
                    end: data.position,
                    bandwidth: data.bandwidth,
                };
            }
            previousSettings = data;
        }).filter((data: any) => data !== undefined);

        fetch(`${this.config.serverAdd}:${this.config.serverPort}/prepThrottle`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ profile: this.throttleProfile }),
        })
    }


    public updateThrottleProxy(sessionData: any) {
        if (!sessionData || !sessionData[sessionData.length - 1].position) {
            return
        }
        const currentData = sessionData[sessionData.length - 1]
        if (sessionData[sessionData.length - 1].playerState === 'Stopped') {
            return this.resetThrottleProxy();
        }
        this.throttleProfile.map((profile: any) => {
            if (currentData.position / 60 >= profile.start && currentData.position / 60 <= profile.end && this.currentBandwidth !== profile.bandwidth) {
                this.currentBandwidth = profile.bandwidth
                fetch(`${this.config.serverAdd}:${this.config.serverPort}/updateThrottle/${profile.bandwidth}`, { method: 'POST' });
            }
        })

    };

    public resetThrottleProxy() {
        fetch(`${this.config.serverAdd}:${this.config.serverPort}/resetThrottle`, { method: 'POST' })
    }
}
