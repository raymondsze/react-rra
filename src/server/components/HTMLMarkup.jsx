import React, { PropTypes } from 'react';

// HTML Markup component, used for server-side rendering
const HTMLMarkup = ({
  content, htmlAttributes, metas, styles, scripts, inlineStyles, inlineScripts,
}) =>
  (
    <html lang="en" {...htmlAttributes}>
      <head>
        {metas}
        {/* the style tags, both built and external css */}
        {styles}
        {inlineStyles}
      </head>
      <body>
        {/* server side rendering */}
        {/* component is mounted at root element */}
        {/* eslint-disable react/no-danger */}
        <div id="react-root" dangerouslySetInnerHTML={{ __html: content }} />
        {/* eslint-enable react/no-danger */}
        {/* hydrate the store state */}
        {inlineScripts}
        {/* scripts should be load inside body */}
        {scripts}
      </body>
    </html>
  );

HTMLMarkup.defaultProps = {
  htmlAttributes: {},
  metas: [],
  styles: [],
  scripts: [],
  content: '',
  inlineStyles: [],
  inlineScripts: [],
};

HTMLMarkup.propTypes = {
  htmlAttributes: PropTypes.shape({}),
  metas: PropTypes.arrayOf(PropTypes.element),
  styles: PropTypes.arrayOf(PropTypes.element),
  scripts: PropTypes.arrayOf(PropTypes.element),
  content: PropTypes.string,
  inlineStyles: PropTypes.arrayOf(PropTypes.element),
  inlineScripts: PropTypes.arrayOf(PropTypes.element),
};

export default HTMLMarkup;
