import React from 'react';
import Rater from 'react-rater';
import 'react-rater/lib/react-rater.css';
import './App.css';

export const Feedback = ({feedback: {imgUrl, rating, feedback}}) => {
  return (
    <div className="feedback">
      <div>
        <img src={imgUrl} alt="Author" />
        <p>
          {feedback}
        </p>
      </div>
      <Rater total={5} rating={rating} interactive={false} />
    </div>
  );
};
