import React from 'react';
import {GIPHY_API_KEY} from "../../constants";

class RandomGifComponent extends React.PureComponent {

  componentDidMount() {

    const tags = [
      'computers', 'patience', "8bit", 'relax', 'coffee', 'whatever',
      'waiting', 'bored', 'boring', 'kitten', 'owl', 'slow'
    ];
    const idx = Math.floor(Math.random() * tags.length);
    const tag = tags[idx];
    console.log('giphy tag:', tag);

    const request = new XMLHttpRequest();
    request.open('GET', 'https://api.giphy.com/v1/gifs/random?api_key=' + GIPHY_API_KEY + '&tag=' + tag, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        const data = JSON.parse(request.responseText).data;
        // console.log('giphy response:', data);
        const url = data.image_url;
        document.getElementById("giphyme").innerHTML = '<center><img src="'+url+'" title="" style="max-width: 100%; height: auto;"></center>';
      }
      else {
        console.log('reached giphy, but API returned an error', request.status);
      }
    };

    request.onerror = function() {
      console.log('connection error');
    };

    request.send();
  }

  render() {
    return (
      <div className="container">
        <div id="giphyme"></div>
      </div>
    );
  }
}

export default RandomGifComponent;