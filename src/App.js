import React, { Component } from 'react';
import { FeedbackForm } from './FeedbackForm';
import { Feedback } from './Feedback';
import Loading from 'react-loading-bar';
import 'react-loading-bar/dist/index.css';
import './App.css';

class App extends Component {
  url =
    process.env.NODE_ENV === 'production'
      ? 'https://autostar17.azurewebsites.net/api/'
      : 'http://localhost:7071/api/';

  state = {
    curRating: 0,
    showLoader: false,
    feedbacks: []
  };

  componentDidMount() {
    this.setState({ showLoader: true });

    fetch(this.url + 'fetchFeedbacks')
      .then(res => res.json())
      .then(json => {
        this.setState({ feedbacks: json.reverse(), showLoader: false });
      });
  }

  setRating = rating => {
    this.setState({ curRating: rating });
  };

  handleFeedbackChange = feedback => {
    this.setState({ showLoader: true });
    fetch(this.url + 'autoStar', {
      method: 'post',
      body: JSON.stringify({ feedback }), // that? Yup. Also, the var name feedback may be casing an issue?
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => {
        const sentimentScore =
          json.documents && json.documents[0] ? json.documents[0].score : 0;
        this.setState({
          curRating: Math.round((sentimentScore * 10) / 2),
          showLoader: false
        });
        console.log(json);
      });
  };

  handleFormSubmit = (feedback, rating) => {
    this.setState({ showLoader: true });
    fetch(this.url + 'saveFeedback', {
      method: 'post',
      body: JSON.stringify({ feedback, rating }), // that? Yup. Also, the var name feedback may be casing an issue?
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(json => {
        console.log(json);
        this.setState({
          feedbacks: [...json, ...this.state.feedbacks],
          showLoader: false
        });
      });
  };

  render() {
    return (
      <div className="App">
        <Loading show={this.state.showLoader} color="#eea337" />
        <FeedbackForm
          curRating={this.state.curRating}
          handleFeedbackChange={this.handleFeedbackChange}
          handleFormSubmit={this.handleFormSubmit}
          setRating={this.setRating}
        />
        <div>
          {this.state.feedbacks.map(feedback => (
            <Feedback feedback={feedback} key={feedback._id} />
          ))}
        </div>
      </div>
    );
  }
}

export default App;
