if (module['hot']) {
    module['hot'].accept();
}

import * as React from 'react';
import { Header } from './Header';

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return (
            <div id="main">
                <Header />
                <section id="wrapper">
                    {this.props.children}
                </section>
            </div>);
    }
}
