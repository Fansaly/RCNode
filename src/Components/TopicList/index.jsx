import React from 'react';
import classNames from 'classnames';
import TopiCard from '../../Components/TopiCard';
import './topiclist.styl';

class TopicList extends React.Component {
  render() {
    const { items, className } = this.props;

    return (
      <div className={classNames(
        'topic-list-container',
        className,
      )}>
        {items.map((item, index) => (
          <div className="topic-list" key={index}>
            {item.map(data => (
              <TopiCard item={data} key={data.id} />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default TopicList;
