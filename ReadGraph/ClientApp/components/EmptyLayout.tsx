if (module['hot']) {
    module['hot'].accept();
}

import * as React from 'react';
import { Header } from './Header';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class EmptyLayout extends React.Component<LayoutProps, {}> {
    public render() {
        return (
            <div id="main">
                {this.props.children}
            </div>);
    }
}
