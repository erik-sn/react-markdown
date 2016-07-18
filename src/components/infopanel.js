import React from 'react';
import Login from './login';
import User from './user';

const InfoPanel = (props) => {
  const markdownList = props.markdowns.map((markdown, index) => (
    <li
      key={index}
      className={`markup-item ${props.id === markdown.id ? 'markdown-active' : ''}`}
      onClick={() => this.setActiveMarkdown(markdown)}
    >
    {markdown.title.length > 30 ? `${markdown.title.substring(0, 27).trim()}...` : markdown.title}
    </li>
  ));

  return (
    <div id="info-container" className="col-md-2">
      <div id="user-container" onClick={props.login}>
        {props.user ? <User user={props.user} /> : <Login />}
      </div>
      {props.user ? <div id="list-container-label" >Markdowns:</div> : ''}
      <div id="list-container">
        <ul id="markdown-list" >
          {markdownList}
        </ul>
      </div>
    </div>
  );
}

export default InfoPanel;
