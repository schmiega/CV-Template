import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAnchor from "markdown-it-anchor";

/**
 * Reads the CV file based on the specified language.
 * @param {string} lang - The language of the CV file.
 * @param {function} callback - The callback function to handle the result.
 */
async function readMarkdown(lang) {
  try {
    const response = await fetch("cv-files/" + lang + ".md");
    const markdownContent = await response.text();
    return markdownContent;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}


function setIcons(md) {
  const defaultRender = md.renderer.rules.heading_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
    const token = tokens[idx];
    const classAttr = token.attrGet('class');

    if (classAttr && classAttr.includes('fa-')) {
      const iconClass = classAttr.split(' ').find(cls => cls.startsWith('fa-'));
      tokens[idx + 1].children.unshift({
        type: 'html_inline',
        content: `<i class="${iconClass}" style='font-style: unset;'></i> `,
      });
      token.attrSet('class', classAttr.replace(iconClass, '').trim());
    }

    return defaultRender(tokens, idx, options, env, self);
  };
}


/**
 * Renders the given markdown content using markdown-it library.
 * @param {string} markdownContent - The markdown content to be rendered.
 * @returns {string} - The rendered HTML content.
 */
function renderMarkdown(markdownContent) {
  var md = markdownIt()
    .use(markdownItAttrs)
    .use(markdownItAnchor, {
      slugify: s => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'))
    });

  setIcons(md);

  return md.render(markdownContent);
}

export { renderMarkdown, readMarkdown };