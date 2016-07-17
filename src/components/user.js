import React from 'react';

const User = (props) => (
  <div className="login">
    <div className="user-img-container" >
      <img alt="User" width="90%" className="user-img" src={props.user.avatar_url} />
    </div>
    <div className="user-name">{props.user.login}</div>
  </div>
);

export default User;
