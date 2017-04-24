import React from 'react';
import ReacDOMServer from 'react-dom/server';
import HTMLMarkup from '_server/components/HTMLMarkup';

export default () => (
  ReacDOMServer.renderToStaticMarkup(<HTMLMarkup />)
);
