import React from 'react';
import { fRender, sRender, expect, storageMock } from '../test_helper';
import sinon from 'sinon';

import Title from '../../src/components/title';

describe('Info Panel', () => {
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

  it('has a description field with the description props as text', () => {
      console.log(component.find('#description').html())
    expect(component.find('#description').text()).to.equal(props.description);
  });





});
