import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    Fallback: PropTypes.node,
    onError: PropTypes.func,
  };

  static defaultProps = {
    onError: () => null,
  };

  constructor(props) {
    super(props);
    this.state = {
      error: null,
    };
    this.isLocal = process.env.NODE_ENV === 'local';
  }

  componentDidCatch(error) {
    const { onError } = this.props;
    if (this.isLocal) console.error(error); // eslint-disable-line
    this.setState({ error }, () => onError(error));
  }

  render() {
    const { Fallback, children } = this.props;
    const { error } = this.state;

    if (error) {
      if (this.isLocal) {
        return <div style={{ color: 'red', fontSize: '30px' }}>{error.toString()}</div>;
      }

      if (Fallback) { // render a fallback component
        return <Fallback {...this.state} {...this.props} />;
      }

      return null;
    }

    return React.Children.map(children, child => {
      return React.cloneElement(child, {
        ...this.props,
      });
    });
  }
}
