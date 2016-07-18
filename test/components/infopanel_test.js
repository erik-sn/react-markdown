import React from 'react';
import { fRender, sRender, expect, storageMock } from '../test_helper';
import sinon from 'sinon';

import InfoPanel from '../../src/components/infopanel';

describe('Info Panel', () => {
  let component;
  let setmarkdown;
  const props = {
    markdowns: [
        { id: 0, title: 'test1' },
        { id: 1, title: 'test2' },
        { id: 2, title: 'test3' },
    ],
    user: { id: 1, username: 'test name' },
    id: 1,
    login: () => 'test function',
  };

  beforeEach(() => {
    setmarkdown = sinon.spy((markdown) => markdown);
    component = fRender(<InfoPanel setmarkdown={setmarkdown} {...props} />);
  });

  it('has a top level id of info-container', () => {
    expect(component.first().find('#info-container')).to.have.length(1);
  });

  it('has three markdowns', () => {
    expect(component.find('.markup-item')).to.have.length(3);
  });

  it('the second child has an active class', () => {
    expect(component.find('#markdown-list').childAt(1).hasClass('markdown-active')).to.equal(true);
  });

  it('returns the markdown when it is clicked', () => {
    component.find('#markdown-list').childAt(0)
    .simulate('click');
    expect(setmarkdown.calledOnce).to.equal(true);
    expect(setmarkdown.returnValues[0].id).to.equal(0);
    expect(setmarkdown.returnValues[0].title).to.equal('test1');
  });



});
