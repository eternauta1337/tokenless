import React from 'react';
import ReactDisqusThread from 'react-disqus-thread';

class CommentsComponent extends React.Component {

  shouldComponentUpdate(nextProps) {
    return false;
  }

  render() {
    return (
      <div>
        <ReactDisqusThread
        shortname="tokenless"
        identifier={`tokenless-prediction-${this.props.predictionAddress}`}
        title="Market Discussion"
        url={`http://www.example.com/prediction${this.props.predictionAddress}`}
        category_id=""
        onNewComment={this.props.handleNewComment}/>
      </div>
    );
  }
}

export default CommentsComponent;
