import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';

/**
 * Provides info about the viewport size to the wrapped components
 *
 *  Examples:
 *
 *  <ViewportSize>
 *    <YourComponent></YourComponent>
 *  </ViewportSize>
 *
 *  or
 *
 *  <ViewportSize>
 *    { ({width, height) => <span>{width}</span> }
 *  </ViewportSize>
 */
export default class ViewportSize extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]).isRequired,
  };

  state = {
    height: Infinity,
    width: Infinity,
  };

  componentDidMount() {
    this.updateState();
    window.addEventListener('resize', this.updateState);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateState);
  }

  updateState = () => {
    this.setState({
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    });
  };

  render() {
    const { children } = this.props;

    if (isFunction(children)) {
      return children(this.state);
    }

    return React.Children.map(children, child => React.cloneElement(child, this.state));
  }
}
