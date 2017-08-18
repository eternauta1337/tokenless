import React from 'react';
import ReactDisqusThread from 'react-disqus-thread';

class CommentsComponent extends React.Component {

  shouldComponentUpdate(nextProps) {
    return false;
  }

  render() {
    return (
      <div>
        <ReactDisqusThread title="Market Discussion"/>
      </div>
    );
  }
}

export default CommentsComponent;
