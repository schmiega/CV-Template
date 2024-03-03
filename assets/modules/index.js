// Import modules
import { readMarkdown, renderMarkdown } from "./custom/reader.js";
import { createLangMenu, createNav } from "./custom/nav.js";
import { displayName, displayProfile } from "./custom/profile.js";
import ProgressBar from "progressbar.js";

// Import custom styles
import("../styles/main.scss");

// Import bootstrap
import("bootstrap/dist/css/bootstrap.css");
import("mdb-ui-kit/css/mdb.min.css");
import("bootstrap/dist/js/bootstrap.bundle.min.js");
import("mdb-ui-kit/js/mdb.es.min.js");

// Import other JS modules
import("jquery");
import("jquery-circle-progress");

// Get language from URL
var url = new URL(window.location.href);
var lang = url.searchParams.get("lang");
if (!lang) {
  lang = "en";
}

// Expose language to the global scope
console.log("Selected language (from URL):", lang);
window.lang = lang;

// Read CV - assumes readMarkdown returns a Promise
readMarkdown(lang)
  .then(function (markdownContent) {
    var cvContent = renderMarkdown(markdownContent);
    document
      .getElementById("cv-content")
      .insertAdjacentHTML("beforeend", cvContent);

    // Create navigation menu in left panel
    var leftPanel = document.getElementById("panel");
    createNav(leftPanel);

    return displayProfile(); // Assuming displayProfile returns a Promise
  })
  .then(function (profile) {
    // Create profile section
    document.getElementById("profile").insertAdjacentHTML("beforeend", profile);
    return displayName(); // Assuming displayName returns a Promise
  })
  .then(function (name) {
    // Append name to #profile-name
    document
      .getElementById("profile-name")
      .insertAdjacentHTML("beforeend", name);
  })
  .catch(function (err) {
    console.error("Error:", err);
  });

// Create language menu in left panel
createLangMenu(document.getElementById("panel"));

// Add ProgressBar.js to skills
document.querySelectorAll(".card-body").forEach(function (cardBody) {
  const progressElem = cardBody.querySelector(".progress-bar");
  const percentage = parseInt(progressElem.dataset.percent); // Read from data-percent attribute
  const label = progressElem.querySelector(".progress-label").textContent;
  console.log(label);

  // Access SCSS color from CSS variable
  const progressColor = getComputedStyle(progressElem).getPropertyValue(
    "--bar-color"
  );

  const progressBar = new ProgressBar.Circle(progressElem, {
    color: progressColor,
    strokeWidth: 4,
    trailWidth: 1,
    easing: "easeInOut",
    duration: 1400,
  });
  progressBar.animate(progressValue / 100);
});
