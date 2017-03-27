import React, { PureComponent, PropTypes } from 'react';
import { graphql } from 'react-apollo';
import { defineMessages } from 'react-intl';
import { Button, Card, Image, Icon } from 'semantic-ui-react';
import postsQuery from './posts.gql';

defineMessages({
  message: {
    id: 'message.id',
    defaultMessage: 'some default message',
  },
});

@graphql(postsQuery, {
  props({ data: { loading, posts, fetchMore } }) {
    return {
      loading,
      cursor: posts.cursor,
      posts: posts.posts,
      loadMoreEntries() {
        return fetchMore({
          query: postsQuery,
          variables: {
            cursor: posts.cursor,
          },
          updateQuery: (prevResult, { fetchMoreResult }) => {
            const previousPosts = prevResult.posts.posts;
            const newPosts = fetchMoreResult.posts.posts;
            return {
              posts: {
                cursor: fetchMoreResult.cursor,
                posts: [...previousPosts, ...newPosts],
              },
            };
          },
        });
      },
    };
  },
})
class DemoScene extends PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    posts: PropTypes.shape({}).isRequired,
  };

  componentDidMount() {
    /*
    this.timer = setInterval(() => {
      const scrollTop =
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop;
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight ||
        window.innerHeight;
      const scrolledToBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      if (scrolledToBottom) {
        this.props.loadMoreEntries();
      }
    }, 1000);
    */
  }

  renderPost({ title, subtitle, image, createdAt, updatedAt }) {
    return (
      <Card style={{ width: '100%' }}>
        <Card.Content>
          <Card.Meta style={{ paddingBottom: 10 }}>
            Recommended for you based on your interests
          </Card.Meta>
          <Image
            floated="left"
            size="mini"
            shape="circular"
            src="https://avatars2.githubusercontent.com/u/15674149?v=3&s=88"
          />
          <Card.Meta>
            <a style={{ color: '#21ba45' }}>
              Raymond Sze
            </a>
            {' in '}
            <a style={{ color: '#21ba45' }}>
              REACT EXAMPLE
            </a>
          </Card.Meta>
          <Card.Meta>
            <div style={{ fontSize: 12 }}>Mar 13 · 3 min read</div>
          </Card.Meta>
          <Card.Description>
            <h2 style={{ color: 'black' }}>
              Complete Arcitecture of a React Application
            </h2>
            <Image src="https://cdn-images-1.medium.com/fit/t/1600/480/1*D5gMpKqTP9GMzp3-wpDD7A.png" />
            <h3>
              Modern web must adapt to various screen sizes. Mobile…
            </h3>
            <span style={{ fontSize: 12 }}>Read more...</span>
            <div>
              <div style={{ float: 'left' }}>
                <Button style={{ fontSize: 16, background: 'transparent' }} icon circular>
                  <Icon name="empty heart" />
                </Button>
                20
              </div>
              <div style={{ float: 'right' }}>
                <Button style={{ fontSize: 16, background: 'transparent' }} icon circular>
                  <Icon name="bookmark outline" />
                </Button>
                <Button style={{ fontSize: 16, background: 'transparent' }} icon circular>
                  <Icon name="chevron down" />
                </Button>
              </div>
            </div>
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

  renderPendingPost() {
    return (
      <Card style={{ width: '100%' }}>
        <Card.Content>
          <Card.Header>
            Loading...
          </Card.Header>
          <Card.Meta>
            Loading...
          </Card.Meta>
          <Card.Description>
            Loading...
          </Card.Description>
        </Card.Content>
      </Card>
    );
  }

  render() {
    const { posts } = this.props;
    return (
      <div>
        {this.renderPost({ title: 'Title', subtitle: 'Subtitle', createdAt: 'Created At' })}
        {this.renderPendingPost()}
      </div>
    );
  }
}

export default DemoScene;
