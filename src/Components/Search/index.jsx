import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import IconSearch from '@material-ui/icons/Search';
import IconClear from '@material-ui/icons/Clear';
import './search.styl';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      isEmpty: true,
      isFocus: false,
    };
  }

  handleClear = event => {
    this.setState({
      value: '',
      isEmpty: true,
    });
  };

  handleBlur = event => {
    this.setState({ isFocus: false });
  };

  handleFocus = event => {
    this.setState({ isFocus: true });
  };

  handleChange = event => {
    const value = (event.target.value).trim()

    this.setState({
      value,
      isEmpty: !/[^\s]/.test(value),
    });
  };

  render() {
    const { isEmpty, isFocus } = this.state;

    return (
      <form id="search" className="form">
        <IconButton className="icon search">
          <IconSearch/>
        </IconButton>
        <IconButton
          className={`icon clear${isEmpty ? '' : ' appear'}`}
          onClick={this.handleClear}
        >
          <IconClear/>
        </IconButton>
        <input type="text"
          className={`input${isFocus ? ' focus' : ''}`}
          value={this.state.value}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export default Search;
