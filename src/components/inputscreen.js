import React from 'react';

const Inputscreen = (props) => (
  <div id="input-screen" className="col-md-5 text-container input-screen" >
    <textarea className="text-input" onChange={props.update} value={props.text}></textarea>
  </div>
);

export default Inputscreen;
