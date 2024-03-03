import { load } from "cheerio";

export function wrapTimelineMeta(html) {
  const $ = load(html);
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

export function wrapCards(html) {
  const $ = load(html);

  // Add a grid to cards and skills sections
  const sections = $(".cards, .skills");
  sections.each(function () {
    const h2 = $(this).find("h2").clone(); // Clone the h2 element
    // Move section content except h2
    const content = $(this).children().not("h2");
    $(this).empty().append("<div class='row'></div>");
    $(this).find(".row").append(content);
    // Append h2 to section element
    $(this).prepend(h2);
  });

  // Wrap card contents in card-body
  const cards = $(".cards .subsection");
  cards.each(function () {
    $(this).wrap("<div class='card'></div>");
    const $h3 = $(this).find("h3");
    $h3.addClass("card-header").prependTo($(this).parent());
    $(this).removeClass("subsection").addClass("card-body");
  });
  // Wrap skill contents in card-body
  const skills = $(".skills .subsection");
  skills.each(function () {
    $(this).wrap("<div class='card skill'></div>");
    const $h3 = $(this).find("h3");
    $h3.addClass("card-header").prependTo($(this).parent());
    $(this).removeClass("subsection").addClass("card-body");
  });

  // Add progress bar to skills
  const skillElems = $(".skill");
  skillElems.each(function () {
    const $ul = $(this).find("ul:first-of-type");
    const label = $ul.find("li").first().contents().toString().trim();
    const percent = parseInt(
      // Assumes notation x% or x (% implied)
      $ul.find("li").last().contents().toString().replace("%", "")
    );
    console.log(label, percent);

    const labelNode = `<span class="progress-label">${label}</span>`;
    const progressNode = `<div class="progress-bar" role="progressbar" \
                          data-percent="${percent}" aria-valuenow="${percent}" \
                          aria-valuemin="0" aria-valuemax="100">${labelNode}</div>`;
    $(this).find(".card-body").append(progressNode);
    $ul.remove();
  });

  return $.html();
}
