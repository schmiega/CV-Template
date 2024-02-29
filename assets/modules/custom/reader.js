import cheerio from "cheerio";
import markdownIt from "markdown-it";
import markdownItAttrs from "markdown-it-attrs";
import markdownItAnchor from "markdown-it-anchor";
import * as plugins from "./markdownItPlugins";

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
  var md = markdownIt()
    .use(markdownItAttrs)
    .use(markdownItAnchor, {
      slugify: (s) =>
        encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, "-")),
    })
    .use(plugins.section("h2", "section", "h3", "subsection"))
    .use(plugins.fontAwesome);

  let htmlContent = md.render(markdownContent);

  return wrapTimelineMeta(htmlContent);
}

function wrapTimelineMeta(htmlContent) {
  const load = cheerio.load;
  const $ = load(htmlContent);
  $(".timeline .subsection").each(function () {
    const $this = $(this);
    const $h3 = $this.find("h3");
    let $ul = $this.find("ul:has(.place), ul:has(.time)");
    const $wrapper = $('<div class="timeline-meta"></div>');
    $wrapper.append($h3);
    if ($ul.length > 0) {
      $wrapper.append($ul);
    }
    $this.append($wrapper);
  });

  return $.html();
}
