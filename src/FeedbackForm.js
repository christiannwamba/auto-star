import React from 'react';
import Rater from 'react-rater';
import throttle from 'lodash.throttle'; 
import 'react-rater/lib/react-rater.css';
import './App.css';

export const FeedbackForm = ({
  handleFormSubmit,
  handleFeedbackChange,
  setRating,
  curRating = 0
}) => {
  const [feedback, setFeedback] = React.useState('');

  // See https://stackoverflow.com/a/54666498/2621113
  const throttledChangeHandler = React.useRef(
    throttle(feedback => handleFeedbackChange(feedback), 1500)
  );
  React.useEffect(() => {
    if (!!feedback) {
      return throttledChangeHandler.current(feedback);
    }
  }, [feedback]);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        handleFormSubmit(feedback);
      }}
    >
      <div className="label-stars">
        <label htmlFor="feedback">What do you think?</label>
        <Rater
          total={5}
          rating={curRating}
          onRate={({ rating }) => {
            setRating(rating);
          }}
        />
      </div>
      <textarea
        name="feedback"
        id="feedback"
        cols="30"
        rows="5"
        value={feedback}
        onKeyPress={e => {
          if (e.which === 13 && !e.shiftKey) {
            e.preventDefault();
            handleFormSubmit(feedback, curRating);
            setFeedback('');
          }
        }}
        onChange={e => {
          setFeedback(e.target.value);
        }}
        placeholder="Love or hate? No hard feelings!"
      />
    </form>
  );
};
