import React from 'react';
import { connect } from 'react-redux';
import {
  matchTab,
  getNewDataCreate,
} from '../../common';
import { get as getData } from '../../api';

import Layout from '../../Layout';
import TopicList from '../../Components/TopicList';
import Progress from '../../Components/Progress';
import ActionDial from '../../Components/ActionDial';
import Notification from '../../Components/Notification';
import Editor from '../../Components/Editor';

class Home extends React.Component {
  state = {
    status: 'idle',
    tab: 'all',
    page: 1,
    limit: 20,
    mdrender: true,
    items: [],
  };

  fetchTopics = async () => {
    const {
      tab,
      page,
      limit,
      mdrender,
    } = this.state;

    const params = {
      url: '/topics',
      params: {
        tab,
        page,
        limit,
        mdrender,
      },
    };

    const { status, data } = await getData(params);

    if (status) {
      this.setState(state => ({
        status: 'success',
        page: (state.page + 1),
        items: [...state.items, data],
      }), () => {
        this.setState({ status: 'idle' });
      });
    } else {
      this.setState({ status: 'error' });
    }
  };

  fetchData = () => {
    if (/idle|error/.test(this.state.status)) {
      this.setState({
        status: 'loading',
      }, () => {
        this.fetchTopics();
      });
    }
  };

  handleScroll = () => {
    const threshold = 20;
    const windowHeight = window.innerHeight;
    const documentHeight = document.body.offsetHeight;
    const scrollHeight = document.documentElement.scrollTop;

    if (documentHeight - (windowHeight + scrollHeight) <= threshold) {
      this.fetchData();
    }
  };

  componentWillMount() {
    const tab = matchTab(this.props.location);
    this.setState({ tab });
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handleScroll);
    this.fetchData();
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll, false);
  }

  componentWillReceiveProps(nextProps) {
    const nextSearch = nextProps.location.search;
    const prevSearch = this.props.location.search;
    const nextTab = matchTab(nextProps.location);

    if (nextSearch !== prevSearch) {
      this.setState({
        status: 'idle',
        tab: nextTab,
        page: 1,
        items: [],
      }, () => {
        this.fetchData();
      });
    }

    const newDataCreate = getNewDataCreate(nextProps);

    if (Boolean(newDataCreate)) {
      const { tab } = this.state;
      const { tab: publishTab } = newDataCreate;

      [publishTab, 'all'].includes(tab) && this.setState(state => ({
        items: [
          [{
            ...newDataCreate,
          }],
          ...state.items,
        ],
      }));
    }
  }

  render() {
    const { items, status } = this.state;

    return (
      <Layout>
        <div id="container">
          <div className="wrapper">
            <TopicList items={items} />
          </div>

          <div className="status wrapper">
            <Progress status={status} />
          </div>
        </div>

        <ActionDial single />
        <Editor />
        <Notification />
      </Layout>
    );
  }
}

const mapStateToProps = ({ auth, editor }) => ({
  ...auth,
  ...editor,
});

export default connect(
  mapStateToProps,
)(Home);
