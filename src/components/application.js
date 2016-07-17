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
    this.cancel = this.cancel.bind(this);
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
      })
      .catch(() => {
        this.setState({ error: 'There was an error logging in through Github.' });
      });
    }

    // set event listener on window
    window.addEventListener('resize', () => this.adjustScreen());
    this.adjustScreen();
    
    // retrieve any data that was stored in local storage and set it into the this.state.
    // this also helps when a user uses the github login to save their work
    const data = JSON.parse(localStorage.getItem('data'));
    if (data) {
      this.setState(data);
    }
  }

  adjustScreen() {
    const infoColumn = document.getElementById('info-container');
    const resultScreen = document.getElementById('result-screen');
    const inputScreen = document.getElementById('input-screen');
    const error = document.getElementById('error-container');
    if (window.innerWidth < 775) {
      infoColumn.style.display = 'none';
      resultScreen.style.maxHeight = '400px';
      inputScreen.style.maxHeight = '400px';
      error.style.height = '';
      error.style.lineHeight = '';
    } else {
      infoColumn.style.display = 'block';
      resultScreen.style.maxHeight = '';
      inputScreen.style.maxHeight = '';
      error.style.height = '75px';
      error.style.lineHeight = '75px';
    }
  }

  login() {
    const clientId = '94fd601ce029c233e7c4';
    window.open(`https://github.com/login/oauth/authorize?redirect_uri=http://localhost:3000/&client_id=${clientId}`, '_self');    
  }

  fetchMarkups(id) {
    axios.get(`${API}/markup/${id}/`)
    .then((response) => {
      console.log(response.data);
      this.setState({ availableMarkups: response.data, error: '' });
    })
    .catch(() => {
      this.setState({ error: 'An error occured while retrieving your markdowns from the database.' });
    });
  }

  saveMarkup(id, user, title, description, text) {
    axios.put(`${API}/markup/${user}/${id}/`, { id, user, title, description, text })
    .then(() => {
      this.fetchMarkups(user);
    })
    .catch(() => {
      this.setState({ error: 'An error occured while saving/creating your markdown.' });
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
    }
    this.cancel();
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
        this.setState({ error: 'An error occured while creating your markdown.' });
      });
    }
  }

  deleteMarkup() {
    const { id, user } = this.state;
    if (user) {
      axios.delete(`${API}/markup/${user.id}/${id}/`)
      .then(() => {
        this.cancel();
        this.fetchMarkups(user.id);
      })
      .catch(() => {
        this.setState({ error: 'An error occured while deleting your markup.' });
      });
    }
  }

  cancel() {
    this.setState({
      id: undefined,
      title: '',
      description: '',
      text: '',
      error: '',
    });
  }

  saveData(title, description, text, id) {
    if (title.trim().length > 0 || description.trim().length > 0 || text.trim().length > 0) {
      localStorage.setItem('data', JSON.stringify({ id, title, description, text }));
    }
  }

  render() {
    const { id, user, title, description, text, availableMarkups, error } = this.state;
    this.saveData(title, description, text, id);


    const minimum = title.trim().length > 0 ? true : false;
    const markdowns = availableMarkups.map((markdown, index) => (
      <li
        key={index}
        className={`markup-item ${id === markdown.id ? 'markdown-active' : ''}`}
        onClick={() => this.setActiveMarkup(markdown)}
      >
      {markdown.title.length > 30 ? `${markdown.title.substring(0, 27).trim()}...` : markdown.title}
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
              <button className="btn btn-sm" onClick={this.newMarkup} >New</button>
              {minimum ? <button className="btn btn-sm"onClick={this.saveOrCreateMarkup} >Save</button> : ''}
              {id ? <button className="btn btn-sm"onClick={this.deleteMarkup} >Delete</button> : ''}
              <button className="btn btn-sm" onClick={this.cancel} >Cancel</button>
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
              {user ? <div id="list-container-label" >Markdowns:</div> : ''}
              <div id="list-container">
                <ul id="markdown-list" >
                  {markdowns}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
