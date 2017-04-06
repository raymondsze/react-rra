import React, { PureComponent } from 'react';
import { Icon, Button, Divider } from 'semantic-ui-react';
// import styled from 'styled-components';
import logo from '~/app/containers/IndexScene/logo.png';
import DemoScene from '~/app/containers/DemoScene';

class IndexScene extends PureComponent {
  render() {
    return (
      <div className="banner">
        <div style={{ textAlign: 'center' }}>
          <div style={{ background: 'linear-gradient(#404040, #000000)', padding: 20 }}>
            <img style={{ height: 80 }} alt="React-Redux-Apollo-Example" src={logo} />
            <h1 style={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif' }}>
              <span style={{ color: 'rgb(198, 225, 254)' }}>R</span>eact-
              <span style={{ color: 'rgb(198, 225, 254)' }}>R</span>edux-
              <span style={{ color: 'rgb(198, 225, 254)' }}>A</span>pollo
            </h1>
            <h4 style={{ color: '#FFFFFF', fontFamily: 'Roboto, sans-serif', fontWeight: 100 }}>
              Application with (<b>React</b> + <b>Redux</b> + <b>Apollo</b>) Stack
            </h4>
            <p>
              <Icon style={{ color: '#FFFFFF' }} name="github" size="huge" />
              <a style={{ color: '#FFFFFF', fontSize: 20, verticalAlign: 'middle' }}>View on Github</a>
            </p>
            <p>
              <Button
                color="yellow"
                content="Star"
                icon="star"
                label={{ basic: true, color: 'yellow', pointing: 'left', content: '2,048' }}
              />
              <Button
                color="blue"
                content="Fork"
                icon="fork"
                label={{ basic: true, color: 'blue', pointing: 'left', content: '1,048' }}
              />
            </p>
            <p>
              <span style={{ color: '#FFFFFF' }}>
                Created with <Icon name="heart" color="red" /> by <em>@raymondsze</em>
              </span>
            </p>
          </div>
          <DemoScene />
          <DemoScene />
          <DemoScene />
          <DemoScene />
          <DemoScene />
          <DemoScene />
        </div>
      </div>
    );
  }
}

export default IndexScene;
