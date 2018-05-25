import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { EmptyLayout } from './components/EmptyLayout';
import { Dashboard } from './components/Dashboard';
import { VideoPlayer } from './components/VideoPlayer';

export const routes = <div>
    <RouteWithLayout layout={Layout} exact path='/' component={ Dashboard } />
    <RouteWithLayout layout={EmptyLayout} path='/video' component={ VideoPlayer } />
</div>;


function RouteWithLayout({layout, component, ...rest}){
    return (
      <Route {...rest} render={(props) =>
        React.createElement( layout, props, React.createElement(component, props))
      }/>
    );
  }
