if (process.env.BROWSER) {
  require('../sass/style.scss');
}

import React, { Component } from 'react';
import marked from 'marked';
import axios from 'axios';

import Footer from './footer';
import Inputscreen from './inputscreen';
import Login from './login';
import User from './user';
const API = 'http://localhost:8000/api';

export default class Application extends Component {

  constructor(props) {
    super(props);
    this.state = {
      state: Math.random().toString(36).substring(7),
      title: '',
      description: '',
      text: '',
      markUp: '',
      user: undefined,
      id: undefined,
      availableMarkups: [],
      error: '',
    };
    this.setActiveMarkup = this.setActiveMarkup.bind(this);
    this.login = this.login.bind(this);
    this.newMarkup = this.newMarkup.bind(this);
    this.saveOrCreateMarkup = this.saveOrCreateMarkup.bind(this);
    this.deleteMarkup = this.deleteMarkup.bind(this);
  }

  componentDidMount() {
    // login user if available
    const url = window.location.href;
    const code = /code=([^&]+)/.exec(url);
    if (code) {
      axios.get(`${API}/auth/${code[1]}/`)
      .then(response => {
        this.setState({ user: response.data });
        this.fetchMarkups(response.data.id);
      });
    }

    // set event listener on window
    const infoColumn = document.getElementById('info-container');
    const resultScreen = document.getElementById('result-screen');
    const inputScreen = document.getElementById('input-screen');
    window.addEventListener('resize', () => {
      if (window.innerWidth < 775) {
        infoColumn.style.display = 'none';
        resultScreen.style.maxHeight = '400px';
        inputScreen.style.maxHeight = '400px';
      } else {
        infoColumn.style.display = 'block';
        resultScreen.style.maxHeight = '';
        inputScreen.style.maxHeight = '';
      }
    });
  }

  login() {
    const clientId = '94fd601ce029c233e7c4';
    window.open(`https://github.com/login/oauth/authorize?redirect_uri=http://localhost:3000/&client_id=${clientId}`, '_self');    
  }

  fetchMarkups(id) {
    axios.get(`${API}/markup/${id}/`)
    .then((response) => {
      this.setState({ availableMarkups: response.data.results, error: '' });
    })
    .catch(() => {
      this.setState({ error: 'An error occured while retrieving your markups from the database.' });
    });
  }

  saveMarkup(id, user, title, description, text) {
    axios.put(`${API}/markup/${user}/${id}/`, { id, user, title, description, text })
    .then(() => {
      this.fetchMarkups(user);
    });
  }

  setActiveMarkup(markup) {
    this.setState({
      id: markup.id,
      title: markup.title,
      description: markup.description,
      text: markup.text,
    });
  }

  newMarkup() {
    const { id, user, title, description, text } = this.state;
    if (user) {
      this.saveMarkup(id, user.id, title, description, text);
      this.setState({
        id: undefined,
        title: '',
        description: '',
        text: '',
        error: '',
      });
    }
  }

  saveOrCreateMarkup() {    
    const { id, user, title, description, text } = this.state;
    if (id && user) {
      this.saveMarkup(id, user.id, title, description, text);
    } else if (user) {
      axios.post(`${API}/markup/${user.id}/`, {
        user: user.id,
        title,
        description,
        text,
      })
      .then((response) => {
        this.setActiveMarkup(response.data);
        this.fetchMarkups(user.id);
      })
      .catch(() => {
        this.setState({ error: 'An error occured while saving/creating your markup.' });
      });
    }
  }

  deleteMarkup() {
    const { id, user } = this.state;
    if (user) {
      axios.delete(`${API}/markup/${user.id}/${id}/`)
      .then(() => {
        this.setState({
          id: undefined,
          title: '',
          description: '',
          text: '',
          error: '',
        });
        this.fetchMarkups(user.id);
      })
      .catch(() => {
        this.setState({ error: 'An error occured while deleting your markup.' });
      });
    }
  }

  render() {
    const { user, title, description, text, availableMarkups, error } = this.state;
    const markups = availableMarkups.map((markup, index) => (
      <li
        key={index}
        className="markup-item"
        onClick={() => this.setActiveMarkup(markup)}
      >
      {markup.title}
      </li>
    ));

    return (
      <div>
        <div id="app-container" className="container" >
          <div id="top-container" className="row">
            <div id="title-container" className="col-md-6">
              <input
                id="title"
                value={title}
                placeholder="Title"
                onChange={(e) => this.setState({ title: e.target.value, error: '' })}
              />
              <input
                id="description"
                value={description}
                placeholder="Description"
                onChange={(e) => this.setState({ description: e.target.value, error: '' })}
              />
            </div>
            <div id="error-container" className="col-md-4" >
              <span>{error}</span>
            </div>
          </div>
          <div id="button-container" className="row">
            <div id="db-container" className="col-md-6" >
              <button id="save" onClick={this.newMarkup} >New</button>
              <button id="save" onClick={this.saveOrCreateMarkup} >Save</button>  
              <button id="delete" onClick={this.deleteMarkup} >Delete</button>
              <button id="delete" onClick={this.deleteMarkup} >Cancel</button>
            </div>
          </div>
          <div id="screen-container" className="row">
            <Inputscreen text={text} update={(e) => this.setState({ text: e.target.value, error: '' })} />
            <div className="col-md-5 text-container result-screen" id="result-screen" >
              <div id="result" className="text-input" dangerouslySetInnerHTML={{ __html: marked(text) }}></div>
            </div>
            <div id="info-container" className="col-md-2">
              <div id="user-container" onClick={this.login}>
                {user ? <User user={user} /> : <Login />}
              </div>
              <ul id="list-container">
                {markups}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
