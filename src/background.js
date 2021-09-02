var rules, activeRules;
var fromValue, toValue;
const defaultRule = [{ from: "", to: "", isActive: false }];

rules = [{ from: "google.com", to: "facebook.com", isActive: true }];
activeRules = [0];

/*
if (localStorage["swapRules"]) {
  rules = localStorage["swapRules"];
  console.log("current swapActiverules: ", rules);
} else {
  rules = defaultRule;
  updateLocalStorage("swapRules", rules);
}

if (localStorage["swapActiverules"]) {
  activeRules = localStorage["swapActiverules"];
  console.log("current swapActiverules: ", activeRules);
} else {
  activeRules = [];
  updateLocalStorage("swapActiverules", activeRules);
}
*/

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    if (details.url.indexOf(fromValue) > -1) {
      console.log(details.url);
      return setEnvironment(details);
    }
  },
  {
    urls: ["<all_urls>"]
  },
  ["blocking"]
);

function setEnvironment(details) {
  let newURL = toValue;
  let oldURL = fromValue;
  return {
    redirectUrl: details.url.replace(oldURL, newURL)
  };
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.update) {
    rules = request.rules;
    activeRules = request.activeRules;
    updateLocalStorage("swapRules", rules);
    updateLocalStorage("swapActiverules", activeRules);
  } else if (request.onLoad) {
    console.log("onload rules: ", rules);
    console.log("onload active rules: ", activeRules);
    sendResponse({
      currentRules: rules
    });
  }
});

function updateLocalStorage(type, newValue) {
  localStorage[type] = newValue;
  console.log("new localstorage " + type + ": " + localStorage[type]);
}
