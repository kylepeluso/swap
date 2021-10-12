const defaultRule = [{ from: "", to: "", isActive: false }];
var rules = checkRules();

function checkRules() {
  try {
    let rulesValue;
    chrome.storage.local.get(["rules"], function(result) {
      rulesValue = result.rules;
      console.log("Rules value currently is " + rulesValue);
    });
    if (typeof rulesValue != "undefined") {
      rules = rulesValue;
    } else {
      rules = defaultRule;
      chrome.storage.local.set({ rules: rules }, function() {
        console.log("Value is set to " + rules);
      });
    }
    return rules;
  } catch (e) {
    console.error(e);
  }
}
