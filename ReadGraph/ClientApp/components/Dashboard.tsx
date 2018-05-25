import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Lightbox from 'react-image-lightbox';
import * as Timeline from '../services/timeline';

let goatPics = [...Array(19).keys()].map(ix => ix+1)		// 19 pics
	.map(ix => `/images/goats/${ix}.jpg`);
goatPics = goatPics.concat(goatPics).concat(goatPics);

export class DashboardState {
    isOpen: boolean = false
    selectedPicture?: string
}

export class Dashboard extends React.Component<RouteComponentProps<{}>, DashboardState> {
    constructor() {
        super();
        this.state = { isOpen: false }
    }

    openPic(pic: string) {

        this.setState({
            isOpen: true,
            selectedPicture: pic
        });

        Timeline.createTimelineActivity('picture', 'Oh! A Goat!', pic);
    }

    public render() {

        const childElements = goatPics.map((goatPic, ix) => {
            let openPicHandler = () => this.openPic(goatPic);
            return (
                <div className="pin" key={ix}>
                    <img src={goatPic} className="goatPic" onClick={openPicHandler} />
                </div>
            );
        });

        return (<div>
            {this.state.isOpen &&
                (<Lightbox
                    mainSrc={this.state.selectedPicture}
                    enableZoom={false}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                />)}
            <div id="columns">
                {childElements}
            </div>
        </div>);
    }
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array: any[]): void {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}