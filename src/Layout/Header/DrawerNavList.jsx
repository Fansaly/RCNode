import React from 'react';
import { withRouter } from 'react-router-dom';
import { navTabsArray as navTabs, navIsActive } from '../../common';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import TopicTypeIcon from '../../Components/TopicTypeIcon';

class DrawerNavList extends React.Component {
  navIsActive = path => {
    return navIsActive(path, this.props.location);
  };

  render() {
    return (
      <List>
        {navTabs.map(({tab, path, name}) => (
          <ListItem
            button
            key={tab}
            component="a"
            selected={this.navIsActive(path)}
            href={`${process.env.PUBLIC_URL}${path}`}
          >
            <ListItemIcon>
              <TopicTypeIcon
                color="inherit"
                all={tab === 'all'}
                good={tab === 'good'}
                tab={tab}
              />
            </ListItemIcon>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    );
  }
}

export default withRouter(DrawerNavList);
