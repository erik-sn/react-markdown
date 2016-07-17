import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import Inputscreen from '../../src/components/inputscreen';

describe('Input Screen', () => {
  let component;
  let update; 

  const state = {
  };

  beforeEach(() => {  
    update = sinon.spy();
    component = mount(<Inputscreen update={update} />);
  });

  it('text is changed when state is changed', () => {
    expect(component.find('textarea').props().value).to.equal('');
    component.setState({ text: 'test' });
    expect(component.find('textarea').props().value).to.equal('test');
  });

  it('updates state when text is typed into the area', () => {
    component.find('textarea').simulate('change', { target: { value: 'test value' } });
    expect(component.state('text')).to.equal('test value');
  });

  it('calls the update function when text is typed into the area', () => {
    component.find('textarea').simulate('change', { target: { value: 'test value' } });
    expect(update.calledOnce).to.equal(true);
  });

});
