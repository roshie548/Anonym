import React from 'react';
import {
  Person,
} from 'blockstack';
import { useConnect } from '@blockstack/connect';
import Post from "./Posts/Post"
import PostObj from '../models/Post'
import { Link } from 'react-router-dom';
import 'antd/dist/antd.css'
import { Button } from 'antd'

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export const Profile = ({ userData, handleSignOut}) => {
  const [isLoading, setLoading] = React.useState(false);
  const [username, setUsername] = React.useState(userData.username);
  const [person, setPerson] = React.useState(new Person(userData.profile));
  const [posts, setPosts] = React.useState([]);

  const { authOptions } = useConnect();
  const { userSession } = authOptions;

  const fetchData = async () => {
    setLoading(true)

    const _posts = await PostObj.fetchOwnList();
    setPosts(_posts);
    setLoading(false);
  }

  React.useEffect(() => {
    fetchData();
  }, [username]);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-offset-3 col-md-6">
          <div className="col-md-12">
            <div className="avatar-section">
              <img src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage } className="img-rounded avatar" id="avatar-image" alt=""/>
              <div className="username">
                <h1><span id="heading-name">{ person.name() ? person.name() : 'Nameless Person' }</span></h1>
                <span>{ username }</span>
                <span>&nbsp;|&nbsp;<a onClick={ handleSignOut.bind(this)}>(Logout)</a></span>
              </div>
            </div>
          </div>
          <div className="col-md-offset-6 col-md-6 float-right">
          <Button size="large" className="btn-success"><Link to="/create">Create New</Link></Button>
          </div>
          <div className="feed">
              <div className="hottest">YOUR POSTS</div>
              {isLoading && <span>Loading...</span>}
              {posts.map((post) => (
                  <Post postId={'/' + post._id} postTitle={post.attrs.title} tagline={post.attrs.tagline} text={post.attrs.excerpt}/>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile