import React from 'react';

const Title = (props) => (
  <div id="title-container" className="col-md-6">
    <input
      id="title"
      value={props.title}
      placeholder="Title"
      onChange={props.titleChange}
    />
    <input
      id="description"
      value={props.description}
      placeholder="Description"
      onChange={props.descriptionChange}
    />
  </div>
);

export default Title;
