import React from 'react';
import { fRender, sRender, expect, storageMock } from '../test_helper';
import sinon from 'sinon';

import Title from '../../src/components/title';

describe('Title panel', () => {
  let component;
  let titleChange;
  let descriptionChange;
  const props = {
    description: 'test description',
    title: 'test title',
  };

  beforeEach(() => {
    titleChange = sinon.spy((e) => e.target.value);
    descriptionChange = sinon.spy((e) => e.target.value);
    component = fRender(<Title titleChange={titleChange} descriptionChange={descriptionChange} {...props} />);
  });

  it('has a top level id of info-container', () => {
    expect(component.first().find('#title-container')).to.have.length(1);
  });

  it('has a bootstrap grid class', () => {
    expect(component.first().find('#title-container').hasClass('col-md-6')).to.equal(true);
  });

  it('has two input fields', () => {
    expect(component.find('input')).to.have.length(2);
  });

  it('has a title field with the title props as text', () => {
    expect(component.find('#title').props().value).to.equal(props.title);
  });

  it('When the title field is changed the changed value is returned', () => {
    const title = component.find('#title');
    title.simulate('change', { target: { value: 'changed title' } });
    expect(titleChange.calledOnce).to.equal(true);
    expect(titleChange.returnValues[0]).to.equal('changed title');
  });

  it('has a description field with the description props as text', () => {
    expect(component.find('#description').props().value).to.equal(props.description);
  });

  it('When the description field is changed the changed value is returned', () => {
    const title = component.find('#description');
    title.simulate('change', { target: { value: 'changed description' } });
    expect(descriptionChange.calledOnce).to.equal(true);
    expect(descriptionChange.returnValues[0]).to.equal('changed description');
  });





});
