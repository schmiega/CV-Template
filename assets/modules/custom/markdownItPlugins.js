export function fontAwesome(md) {
  md.core.ruler.push("font_awesome", function (state) {
    state.tokens.forEach(function (token) {
      if (token.type === "inline" && token.children) {
        for (let i = token.children.length - 1; i >= 0; i--) {
          let child = token.children[i];
          if (child.type === "text") {
            let text = child.content;
            let match = text.match(/:fa-([a-z-]+):/);
            if (match) {
              let before = text.slice(0, match.index);
              let after = text.slice(match.index + match[0].length);
              let icon = new state.Token("html_inline", "", 0);
              icon.content = '<i class="fa fa-' + match[1] + '"></i>';

              if (before) {
                let beforeToken = new state.Token("text", "", 0);
                beforeToken.content = before;
                token.children.splice(i, 1, beforeToken, icon);
                i++;
              } else {
                token.children[i] = icon;
              }

              if (after) {
                let afterToken = new state.Token("text", "", 0);
                afterToken.content = after;
                token.children.splice(i + 1, 0, afterToken);
              }
            }
          }
        }
      }
    });
  });
}

export function section(tag, sectionClass, subTag, subSectionClass) {
  return function (md) {
    let inSection = false;
    let inSubSection = false;

    const defaultRender =
      md.renderer.rules.heading_open ||
      function (tokens, idx, options, env) {
        return md.renderer.renderToken(tokens, idx, options);
      };

    md.renderer.rules.heading_open = function (tokens, idx, options, env) {
      let result = "";
      let classes = tokens[idx].attrGet("class");

      if (tokens[idx].tag === tag) {
        if (inSubSection) {
          result += "</div>";
          inSubSection = false;
        }
        if (inSection) {
          result += "</div>";
        }
        // If the token has classes, add them to the section
        result +=
          '<div class="' + sectionClass + (classes ? " " + classes : "") + '">';
        inSection = true;
      } else if (tokens[idx].tag === subTag) {
        if (inSubSection) {
          result += "</div>";
        }
        // If the token has classes, add them to the subsection
        result +=
          '<div class="' +
          subSectionClass +
          (classes ? " " + classes : "") +
          '">';
        inSubSection = true;
      }
      result += defaultRender(tokens, idx, options, env);
      return result;
    };

    // Close the section and subsection at an hr element
    md.renderer.rules.hr = function () {
      let result = "";
      if (inSubSection) {
        result += "</div>";
        inSubSection = false;
      }
      if (inSection) {
        result += "</div>";
        inSection = false;
      }
      result += "<hr>";
      return result;
    };

    // Close the section and subsection at the end of the document, if one is open
    md.renderer.rules.eof = function () {
      let result = "";
      if (inSubSection) {
        result += "</div>";
        inSubSection = false;
      }
      if (inSection) {
        result += "</div>";
        inSection = false;
      }
      return result;
    };
  };
}