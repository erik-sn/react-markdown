import React from 'react';
import { fRender, sRender, expect, storageMock } from '../test_helper';

import Application from '../../src/components/application';

describe('Application', () => {
  let component;
  window.localStorage = storageMock();

  const state = {
  };

  beforeEach(() => {
    component = fRender(<Application />);
  });

  it('Renders something', () => {
    expect(component).to.exist;
  });

  it('has a top level id of app-container', () => {
    expect(component.first().find('#app-container')).to.have.length(1);
  });

  it('has a footer', () => {
    expect(component.first().find('.footer')).to.have.length(1);
  });

  it('has an input screen', () => {
    expect(component.find('.input-screen')).to.have.length(1);
  });

  it('has a result screen', () => {
    expect(component.find('.result-screen')).to.have.length(1);
  });



});
