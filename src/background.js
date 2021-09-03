var rules = checkValue("swapRules"),
  activeRules = checkValue("swapActiveRules"),
  fromValues = [],
  fromValue,
  toValue;
const defaultRule = [{ from: "", to: "", isActive: false }];

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
    updateLocalStorage("swapActiveRules", activeRules);
  } else if (request.onLoad) {
    rules = checkValue("swapRules");
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

function checkValue(type) {
  let key = localStorage[type];
  if (key) {
    rules = JSON.parse(key);
  } else {
    rules = defaultRule;
    updateLocalStorage("swapRules", rules);
  }
  return rules;
}
