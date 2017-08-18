import React from 'react';

class RandomGifComponent extends React.Component {

  componentWillMount() {

    const q = "computers"; // search query

    const request = new XMLHttpRequest();
    request.open('GET', 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag='+q, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400){
        const data = JSON.parse(request.responseText).data.image_url;
        console.log(data);
        document.getElementById("giphyme").innerHTML = '<center><img src = "'+data+'"  title="GIF via Giphy"></center>';
      } else {
        console.log('reached giphy, but API returned an error');
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
        <div className="text-center">
          <small className="text-muted text-center">
            This might take a few seconds. Please be patient.<br/>
            (it's only 2017)
          </small>
        </div>
        <br/>
        <div id="giphyme"></div>
      </div>
    );
  }
}

export default RandomGifComponent;