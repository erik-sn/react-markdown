if (process.env.BROWSER) {
  require('../sass/style.scss');
}

import React, { Component } from 'react';
import marked from 'marked';
import axios from 'axios';

import Title from './title';
import InfoPanel from './infopanel';
import Inputscreen from './inputscreen';
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
    this.setActiveMarkdown = this.setActiveMarkdown.bind(this);
    this.login = this.login.bind(this);
    this.newMarkup = this.newMarkup.bind(this);
    this.saveOrCreateMarkup = this.saveOrCreateMarkup.bind(this);
    this.deleteMarkup = this.deleteMarkup.bind(this);
    this.cancel = this.cancel.bind(this);
  }


  componentWillMount() {
    // login user if available
    const url = window.location.href;
    const code = /code=([^&]+)/.exec(url);
    if (code) {
      axios.get(`${API}/auth/${code[1]}/`)
      .then(response => {
        this.setState({ user: response.data });
        this.fetchMarkdowns(response.data.id);
      })
      .catch(() => {
        this.setState({ error: 'There was an error logging in through Github.' });
      });
    }
  }

  componentDidMount() {
    // set event listener on window
    window.addEventListener('resize', () => this.adjustScreen());
    this.adjustScreen();

    // retrieve any data that was stored in local storage and set it into the this.state.
    // this also helps when a user uses the github login to save their work
    const data = JSON.parse(localStorage.getItem('data'));
    if (data) {
      this.setActiveMarkdown(data);
    }
  }

  /**
   * Given a markup set all of its fields to the current state
   * @param  {object} markup - markup with id, title, description and text
   */
  setActiveMarkdown(markup) {
    this.setState({
      id: markup.id,
      title: markup.title,
      description: markup.description,
      text: markup.text,
    });
  }

  /**
   * Adjust component CSS based on the width of the screen
   */
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

  /**
   * Redirect the user to github to begin authentication procedure
   */
  login() {
    const clientId = '94fd601ce029c233e7c4';
    window.open(`https://github.com/login/oauth/authorize?redirect_uri=http://localhost:3000/&client_id=${clientId}`, '_self');
  }

  /**
   * Given a user id, fetch all markdowns corresponding to that user from the database
   * @param  {number} id - user's id
   */
  fetchMarkdowns(id) {
    axios.get(`${API}/markup/${id}/`)
    .then((response) => {
      this.setState({ availableMarkups: response.data, error: '' });
    })
    .catch(() => {
      this.setState({ error: 'An error occured while retrieving your markdowns from the database.' });
    });
  }

  /**
   * Save a markdown to the database and then refresh the list
   * @param  {number} id - id of the markdown - null if this is a new markdown
   * @param  {number} user - id of the user
   * @param  {string} title - required title
   * @param  {string} description
   * @param  {string} text
   */
  saveMarkup(id, user, title, description, text) {
    axios.put(`${API}/markup/${user}/${id}/`, { id, user, title, description, text })
    .then(() => {
      this.fetchMarkdowns(user);
    })
    .catch(() => {
      this.setState({ error: 'An error occured while saving/creating your markdown.' });
    });
  }

  /**
   * First save the existing markup and then clear all fields on the page
   */
  newMarkup() {
    const { id, user, title, description, text } = this.state;
    if (user) {
      this.saveMarkup(id, user.id, title, description, text);
    }
    this.cancel();
  }

  /**
   * Called when user clicks save - if the markdown already exists update it in the
   * database. If it does not then create it.
   */
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
        this.setActiveMarkdown(response.data);
        this.fetchMarkdowns(user.id);
      })
      .catch(() => {
        this.setState({ error: 'An error occured while creating your markdown.' });
      });
    }
  }

  /**
   * Delete a markdown from the database based on it's user id
   */
  deleteMarkup() {
    const { id, user } = this.state;
    if (user) {
      axios.delete(`${API}/markup/${user.id}/${id}/`)
      .then(() => {
        this.cancel();
        this.fetchMarkdowns(user.id);
      })
      .catch(() => {
        this.setState({ error: 'An error occured while deleting your markup.' });
      });
    }
  }

  /**
   * Clear all of the fields back to empty/default
   */
  cancel() {
    this.setState({
      id: undefined,
      title: '',
      description: '',
      text: '',
      error: '',
    });
  }

  /**
   * Save a markdown to localStorage
   * @param  {string} title
   * @param  {string} description
   * @param  {string} text
   * @param  {number} id
   */
  saveData(title, description, text, id) {
    if (title.trim().length > 0 || description.trim().length > 0 || text.trim().length > 0) {
      localStorage.setItem('data', JSON.stringify({ id, title, description, text }));
    }
  }

  render() {
    const { id, user, title, description, text, availableMarkups, error } = this.state;
    this.saveData(title, description, text, id);
    const minimum = title.trim().length > 0 ? true : false;

    return (
      <div>
        <div id="app-container" className="container" >
          <div id="top-container" className="row">
            <Title
              title={title}
              description={description}
              titleChange={(e) => this.setState({ title: e.target.value, error: '' })}
              descriptionChange={(e) => this.setState({ description: e.target.value, error: '' })}
            />
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
            <InfoPanel user={user} markdowns={availableMarkups} id={id} login={this.login} />
          </div>
        </div>
      </div>
    );
  }
}
