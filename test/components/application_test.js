import React from 'react';
import { fRender, sRender, expect, storageMock } from '../test_helper';
import sinon from 'sinon';
import jsdom from 'jsdom';

import Application from '../../src/components/application';

describe('Application', () => {
  let component;
  const newMarkup = sinon.spy(Application.prototype, 'newMarkup');
  const saveOrCreateMarkup = sinon.spy(Application.prototype, 'saveOrCreateMarkup');
  const deleteMarkup = sinon.spy(Application.prototype, 'deleteMarkup');
  const cancel = sinon.spy(Application.prototype, 'cancel');
  const state = {
  };

  beforeEach(() => {
    component = sRender(<Application />);
  });

  it('Renders something', () => {
    expect(component).to.exist;
  });

  it('has a top level id of app-container', () => {
    expect(component.first().find('#app-container')).to.have.length(1);
  });

  it('has a result screen', () => {
    expect(component.find('.result-screen')).to.have.length(1);
  });

  it('calls the newMarkup function when new button is clicked', () => {
    component.find('#new-button').simulate('click');
    expect(newMarkup.calledOnce).to.equal(true);
  });

  it('calls the cancel function when cancel button is clicked', () => {
    // cancel is called by other functions so we must check the current count first
    const cancelCount = cancel.callCount;
    component.find('#cancel-button').simulate('click');
    expect(cancel.callCount).to.equal(cancelCount + 1);
  });

  it('should not show the save button until after a title is entered', () => {
    expect(component.find('#save-button')).to.have.length(0);
    component.setState({ title: 'test title' });
    expect(component.find('#save-button')).to.have.length(1);
  });

  it('Should call the saveOrCreateMarkup function when the save button is pressed', () => {
    expect(component.find('#save-button')).to.have.length(0);
    component.setState({ title: 'test title' });
    component.find('#save-button').simulate('click');
    expect(saveOrCreateMarkup.calledOnce).to.equal(true);
  });

  it('Should not show delete button until an id is placed in the app state', () => {
    expect(component.find('#delete-button')).to.have.length(0);
    component.setState({ title: 'test title' });
    expect(component.find('#delete-button')).to.have.length(0);
    component.setState({ id: 1 });
    expect(component.find('#delete-button')).to.have.length(1);
  });

  it('Should call the delete function when the delete button is pressed', () => {
    expect(component.find('#delete-button')).to.have.length(0);
    component.setState({ id: 1 });
    component.find('#delete-button').simulate('click');
    expect(deleteMarkup.calledOnce).to.equal(true);
  });



});
