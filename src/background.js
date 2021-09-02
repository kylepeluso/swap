var env, testVersion, enabledOptions, fsdata, fsversion;
var pubfig = "/pubfig.min.js";
var disabledURL = "about:blank";
var qaURL = "/qa/pubfig.min.js";
var localHost = "http://localhost:8000/build/dist/pubfig.js";

if (localStorage["env"]) {
  env = localStorage["env"];
} else {
  env = "Prod";
  updateLocalStorage("env", env);
}

if (localStorage["testVersion"]) {
  testVersion = localStorage["testVersion"];
} else {
  testVersion = "1";
  updateLocalStorage("testVersion", testVersion);
}

if (localStorage["enabledOptions"]) {
  enabledOptions = localStorage["enabledOptions"];
} else {
  enabledOptions = [];
  updateLocalStorage("enabledOptions", enabledOptions);
}

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    if (
      details.url.indexOf(pubfig) > -1 &&
      details.url.indexOf(qaURL) === -1 &&
      details.url.indexOf("/test/") === -1
    ) {
      fsdata == '';
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, { action: "GET_DATA" });
      });
      console.log(details.url);
      return setEnvironment(details);
    }
  },
  {
    urls: ["<all_urls>"],
  },
  ["blocking"]
);

function setEnvironment(details) {
  let newURL;
  let oldURL = pubfig;
  if (env === "Prod") {
    return;
  } else if (env === "QA") {
    newURL = qaURL;
  } else if (env === "Test") {
    newURL = "/test/" + testVersion + pubfig;
  } else if (env === "Disabled") {
    oldURL = details.url;
    newURL = disabledURL;
  } else if (env === "Local") {
    oldURL = details.url;
    newURL = localHost;
  }
  return {
    redirectUrl: details.url.replace(oldURL, newURL),
  };
}


let contentPort;
chrome.runtime.onConnect.addListener(function (portFrom) {
  if (portFrom.name === 'background-content') {
    portFrom.onMessage.addListener(function (message) {
      fsdata = message.payload.fsdata;
      fsversion = message.payload.version;
    });
  }
});


chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.update) {
    env = request.newEnv;
    testVersion = request.newTestVersion;
    updateLocalStorage("env", env);
    updateLocalStorage("testVersion", testVersion);
  } else if (request.enableLogging) {
    const logType = request.logType;
    updateLocalStorage("enabledOptions", enabledOptions);
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "LOGGING",
        logType: logType
      });
    })
  } else if (request.onLoad) {
    console.log("onload env: ", env);
    sendResponse({
      currentEnv: env,
      currentTestVersion: testVersion,
      currentOptions: enabledOptions,
    });
  } else if (request.refreshPage) {
    chrome.tabs.executeScript({ code: "location.reload();" });
  } else if (request.inspectorLoad) {
    sendResponse({
      fsdata: fsdata,
      fsversion: fsversion
    });
  }
});

function updateLocalStorage(type, newValue) {
  localStorage[type] = newValue;
  console.log("new localstorage " + type + ": " + localStorage[type]);
}
