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

export function wrapCardBody(html) {
  const $ = load(html);
  let isSkills = false;

  // Add a grid to cards and skills sections
  const sections = $(".cards, .skills");
  sections.each(function () {
    // Create a wrapper for the h2 and its content
    const h2Wrapper = $(this).find("h2").clone(); // Clone the h2 element
    const isSkills = $(this).hasClass("skills");

    // Move section content except h2
    const content = $(this).children().not("h2");
    $(this).empty().append("<div class='row'></div>");
    $(this).find(".row").append(content);

    // Append h2 wrapper to the section element
    $(this).prepend(h2Wrapper);
  });

  // Wrap card contents in card-body
  const cards = $(".cards .subsection, .skills .subsection");
  cards.each(function () {
    const $h3 = $(this).find("h3");
    $(this).wrap("<div class='card'></div>");
    $h3.addClass("card-header").prependTo($(this).parent());
    $(this).removeClass("subsection").addClass("card-body");
    // Build progress circle using separate function
    if (isSkills) {
      buildProgressCircle($(this));
    }
  });

  return $.html();
}

function buildProgressCircle(card) {
  const $ = load(card); // Assuming load() function is available
  const label = $("ul li:first-child", card).text();
  const percent = parseInt($("ul li:last-child", card).text().replace("%", ""));

  // Ensure percentage is within valid range
  const progress = Math.max(0, Math.min(percent, 100));

  // Create a container for the progress circle
  const progressContainer = $("<div class='progress-circle'></div>");
  card.find(".card-body").append(progressContainer);

  // Customize the circle with progressbar.js (replace with your actual usage)
  ProgressBar.Circle(progressContainer, {
    color: "#3e95cd",
    strokeWidth: 5,
    trailWidth: 1,
    easing: "easeInOut",
    duration: 1400,
    text: {
      value: `${progress}%`,
      // Adjust positioning as needed
      className: "progress-text",
      style: {
        fontSize: "1rem",
        fontWeight: "bold",
        lineHeight: "14px",
      },
    },
  }).animate(progress);
}

