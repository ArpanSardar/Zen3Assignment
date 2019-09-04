import React from 'react';
import { Link, withRouter, matchPath } from 'react-router-dom';

class Header extends React.Component {
  signOut = () => {
    this.props.logout();
    this.props.history.push('/');
  };
  render() {
    return (
      <nav className='navbar bg-dark'>
        <h1 style={{ marginBottom: 0 }}>
          <Link to='/'>Zen3 Assignment</Link>
        </h1>
        <ul style={{ marginBottom: 0 }}>
          <li>
            <Link to='/'>Workitem</Link>
          </li>
          <li>
            <Link to='/config'>ProcessConfigDetails</Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Header;
