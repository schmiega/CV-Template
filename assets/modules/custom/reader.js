import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAnchor from "markdown-it-anchor";
import * as mdPlugin from "./markdownItPlugins";
import * as htmlPlugin from "./htmlPlugins";

/**
 * Reads the CV file based on the specified language.
 * @param {string} lang - The language of the CV file.
 * @param {function} callback - The callback function to handle the result.
 */
export async function readMarkdown(lang) {
  try {
    const response = await fetch("cv-files/" + lang + ".md");
    const markdownContent = await response.text();
    return markdownContent;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

/**
 * Renders the given markdown content using markdown-it library.
 * @param {string} markdownContent - The markdown content to be rendered.
 * @returns {string} - The rendered HTML content.
 */
export function renderMarkdown(markdownContent) {
  // Apply markdown-it and plugins
  var md = markdownIt()
    .use(markdownItAttrs)
    .use(markdownItAnchor, {
      slugify: (s) =>
        encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-")),
    })
    .use(mdPlugin.section("h2", "section", "h3", "subsection"))
    .use(mdPlugin.fontAwesome);

  // Apply HTML Plugins to output
  let html = md.render(markdownContent);
  html = htmlPlugin.wrapTimelineMeta(html);
  html = htmlPlugin.wrapCards(html);

  return html;
}
