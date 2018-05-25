import * as React from 'react';
import { RouteComponentProps } from 'react-router';

import ReactPlayer from 'react-player'
import * as ComponentMode from '../services/compactMode';

export class VideoPlayer extends React.Component<RouteComponentProps<{}>, {}> {
    componentDidMount() {
        ComponentMode.switchToCompactMode();
    }

    componentWillUnmount() {
        ComponentMode.switchToDefaultMode();
    }

    goBack() {
        this.props.history.push('/');
    }

    public render() {
        return (<div id="player" onClick={this.goBack.bind(this)}>
            <ReactPlayer url='https://goatsdemo.blob.core.windows.net/videos/goats-video-NzLV-nSb0L4.mp4' playing controls loop width="100%" height="100%" />
        </div>);
    }
}
