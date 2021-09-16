const defaultRule = [{ from: "", to: "", isActive: false }];
var rules = checkRules(),
  fromValues = [];

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    for (let x = 0; x < rules.length; x++) {
      let rule = rules[x];
      if (rule.isActive) {
        let fromValue = rule.from;
        let toValue = rule.to;
        if (details.url.indexOf(fromValue) > -1) {
          console.log("matching URL:", details.url);
          return getNewURL(details, fromValue, toValue);
        }
      }
    }
  },
  {
    urls: ["<all_urls>"]
  },
  ["blocking"]
);

function getNewURL(details, from, to) {
  return {
    redirectUrl: details.url.replace(from, to)
  };
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.update) {
    rules = request.rules;
    updateLocalStorage("swapRules", rules);
  } else if (request.onLoad) {
    rules = checkRules();
    console.log("onload rules: ", rules);
    sendResponse({
      currentRules: rules
    });
  }
});

function updateLocalStorage(type, newValue) {
  localStorage[type] = JSON.stringify(newValue);
  console.log("new localstorage " + type + ": " + localStorage[type]);
}

function checkRules() {
  let key = localStorage["swapRules"];
  let rules;
  if (key) {
    rules = JSON.parse(key);
  } else {
    rules = defaultRule;
    updateLocalStorage(key, rules);
  }
  return rules;
}
