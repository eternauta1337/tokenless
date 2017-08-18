/*
 * For some reason, Masonry and Imagesloaded package not work on Codepen
 * Check full source code here:
 * https://github.com/mikunpham/react-giphy
 */
import React from 'react';
import './RandomGifsComponent.css';

class InputKeyword extends React.Component {
  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  _debounce(func, wait, immediate) {
    let timeout;
    return function () {
      let context = this,
        args = arguments;
      let callNow = immediate && !timeout;
      let _delay = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      clearTimeout(timeout);
      timeout = setTimeout(_delay, wait);
      if (callNow) func.apply(context, args);
    };
  }

  handleChange() {
    this.props.onKeywordChange(this.searchKeyword.value);
  }

  render() {
    return (
      <div className="giphy__input">
        <input
          type="text"
          placeholder="While you wait..."
          ref={(ref) => this.searchKeyword = ref}
          onChange={this._debounce(this.handleChange, 800, false)}
        />
      </div>
    );
  }
}

class ImageList extends React.Component {
  render() {
    let images = [],
      returnHTML;
    this.props.imageslist.map((item) => {
      let key = item.id.toString(),
        src = item.images.fixed_width.url;

      images.push(<Image key={key} src={src}/>);
    });
    if (images.length) {
      returnHTML = <ul className="giphy__list">{images}</ul>;
    } else {
      if (this.props.firstLoad) {
        // Don't show 'No result' in first-load stage
        returnHTML = <div></div>;
      } else {
        returnHTML = <div className="error"></div>;
      }
    }
    return (returnHTML);
  }
}

class Image extends React.Component {
  render() {
    return (
      <li className="giphy__item"><img src={this.props.src}/></li>
    );
  }
}

const GIPHY = {
  base_url: "https://api.giphy.com/v1/gifs/",
  query: ["search", "trending", "random", "translate"],
  api_key: "dc6zaTOxFJmzC",
  limit: 20,
  offset: 0
};
let gifUrl = `${GIPHY.base_url}${GIPHY.query[0]}?api_key=${GIPHY.api_key}&limit=${GIPHY.limit}&offset=${GIPHY.offset}`;

class Giphy extends React.Component {
  constructor() {
    super();
    this.state = {
      data: [],
      firstLoad: true
    };
    this.handleKeywordChange = this.handleKeywordChange.bind(this);
    this.createAjax = this.createAjax.bind(this);
  }

  createAjax(keyword, firstLoad) {
    let self = this;
    keyword = encodeURI(keyword);
    let requestURL = `${gifUrl}&q=${keyword}`;
    // Ajax
    const xhr = new XMLHttpRequest();
    xhr.open('GET', requestURL);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
      if (xhr.status === 200) {
        let response = JSON.parse(xhr.responseText).data;
        self.setState({
          data: response,
          firstLoad: firstLoad
        });
      } else {
        console.log('Request failed.  Returned status of ' + xhr.status);
      }
    };
    xhr.send();
  }

  handleKeywordChange(keyword) {
    this.createAjax(keyword, false);
  }

  componentDidMount() {
    this.createAjax(this.props.firstInput, true);
  }

  render() {
    return (
      <div className="giphy__container">
        <InputKeyword firstInput={this.props.firstInput} onKeywordChange={this.handleKeywordChange}/>
        <ImageList imageslist={this.state.data} firstLoad={this.state.firstLoad}/>
      </div>
    );
  }
}

export default Giphy;