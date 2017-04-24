import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { Button, Icon, Menu, Divider, Image } from 'semantic-ui-react';
import classnames from 'classnames';
import logo from './logo.png';

const StyledHeader = styled.header`
  padding-left: 20px;
  padding-right: 20px;
  height: 110px;

  .nav {
    height: 70px;
    line-height: 50px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .nav .nav-home {
    display: inline-block;
  }

  .nav .nav-home .brand {
    font-size: 25px;
    font-weight: 400;
    color: #21ba45;
  }

  .nav-left {
    float: left;
  }

  .nav-right {
    float: right;
  }

  .nav-menu-container {
    position: absolute;
    z-index: 500;
    background: rgba(255, 255, 255, 0.92);
    left: 0;
    right: 0;
    padding-left: 20px;
    padding-right: 20px;
    border-bottom: solid 1px rgba(34, 36, 38, 0.15);
  }

  .nav-menu-container.fixed {
    position: fixed;
    top: 0;
  }

  .nav-menu {
    height: 2.6rem;
    width: 100%;
    overflow: hidden;
  }

  .ui.divider {
    margin: 0;
  }

  .ui.menu {
    overflow-y: hidden;
    padding-bottom: 50px;
  }

  .ui.menu .item {
    color: rgba(0, 0, 0, 0.44);
    padding-left: 10px;
    padding-right: 10px;
    font-weight: 200;
    font-family: Roboto, sans-serif;
  }

  .ui.menu a.item.active,
  .ui.menu a.item:hover,
  .ui.menu a.item:focus,
  .ui.menu a.item.active:hover,
  .ui.menu a.item.active:focus {
    color: #21ba45;
    background: transparent;
  }

  .ui.menu .item:first-child {
    font-weight: 400;
    padding-left: 0;
  }

  .ui.buttons {
    display: inline-block;
    vertical-align: middle;
  }

  .ui.buttons .ui.button {
    background: transparent;
  }

  .avatar {
    display: inline-block;
  }
`;

class Header extends PureComponent {
  state = {
    menuFixed: false,
  };
  // here is to simplify the setting, bind the scroll event
  componentDidMount() {
    if (window) {
      Header.scrollEvent = new Event('scroll.header');
      if (!Header.scrollEventRegistered) {
        window.addEventListener('scroll', () => {
          window.dispatchEvent(Header.scrollEvent);
        });
        Header.scrollEventRegistered = true;
      }
      window.addEventListener('scroll.header', () => {
        const { menuFixed } = this.state;
        if (document.body.scrollTop > 70) {
          if (!menuFixed) this.setState({ menuFixed: true });
        } else if (menuFixed) {
          this.setState({ menuFixed: false });
        }
      });
    }
  }
  componentWillUnmount() {
    if (window) {
      window.removeEventListener('scroll.header');
    }
  }
  render() {
    const { menuFixed } = this.state;
    return (
      <StyledHeader>
        <div className="nav">
          <div className="nav-left">
            <a className="nav-home">
              <span className="brand">
                <img role="presentation" alt="React-Redux-Apollo-Example" style={{ height: 50 }} src={logo} />
              </span>
            </a>
          </div>
          <div className="nav-right">
            <a href>Write a Story</a>
            <Button.Group>
              <Button icon>
                <Icon name="alarm outline" size="large" />
              </Button>
            </Button.Group>
            <Image
              className="avatar"
              src="https://avatars2.githubusercontent.com/u/15674149?v=3&s=88"
              size="mini"
              shape="circular"
            />
          </div>
        </div>
        <Divider />
        <div className={classnames('nav-menu-container', menuFixed ? 'fixed' : '')}>
          <div className="nav-menu">
            <Menu secondary>
              <Menu.Item content="Example:" />
              <Menu.Item content="Infinite Scroll" active onClick={() => null} />
              <Menu.Item content="Pagination" onClick={() => null} />
              <Menu.Item content="Notification" onClick={() => null} />
              <Menu.Item content="Chatroom" onClick={() => null} />
              <Menu.Item content="Author" onClick={() => null} />
            </Menu>
          </div>
        </div>
      </StyledHeader>
    );
  }
}

export default Header;
