<template>
  <div id="rules-wrapper">
    <div id="top">
      <h4 class="label right-align">rules:</h4>
      <div id="buttons">
        <button id="add-button" @click="addRule()">add rule</button>
        <button id="reset-button" @click="resetSettings()">reset</button>
      </div>
    </div>
    <div id="rules-list">
      <div class="hidden">
        ActiveRules: {{ activeRules }} <br />
        Rules: {{ rules }}<br />
        Valid rules: {{ validRules }}<br />
        Formatted rules: {{ formattedRules }}
      </div>
      <div
        v-for="(rule, index) in rules"
        :key="index"
        class="rule"
        :class="{ active: rule.isActive, valid: validRules[index] }"
      >
        <span class="rule-label rule-num">{{ index + 1 }}.</span>
        <input
          type="checkbox"
          :disabled="!validRules[index]"
          @change="updateSettings"
          v-model="rule.isActive"
        />
        <div
          class="check-error-box"
          @click="checkError(index, $event.target)"
          :class="{ visible: !validRules[index] }"
        ></div>
        <span class="rule-label">from</span>
        <input
          type="text"
          class="rule-from"
          @change="updateSettings"
          v-model.lazy="rule.from"
        />
        <span class="rule-label">to</span>
        <input
          type="text"
          class="rule-to"
          @change="updateSettings"
          v-model.lazy="rule.to"
        />
        <button class="remove-rule-button" @click="removeRule(index)">-</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "settingsPage",
  data() {
    return {
      rules: [{ from: "", to: "", isActive: false }],
    };
  },
  computed: {
    activeRules: function () {
      let activeList = [];
      for (let x = 0; x < this.rules.length; x++) {
        if (this.rules[x].isActive) {
          activeList.push(x);
        }
        if (activeList.length > 0) {
          chrome.action.setBadgeBackgroundColor({ color: "#006838" });
          chrome.action.setBadgeText({ text: "➔" });
        } else {
          chrome.action.setBadgeText({ text: "" });
        }
      }
      return activeList.length;
    },
    validRules: function () {
      let validRules = [];
      for (let x = 0; x < this.rules.length; x++) {
        let rule = this.rules[x];
        if (rule.from.length > 4) {
          validRules.push(true);
        } else {
          validRules.push(false);
        }
      }
      return validRules;
    },
    formattedRules: function () {
      let newRules = [];
      for (let x = this.rules.length - 1; x > 0; x--) {
        let rule = this.rules[x];
        if (rule.isActive) {
          let newRule = {
            id: x + 1,
            priority: x + 1,
            action: { type: "redirect", redirect: { url: rule.to } },
            condition: { urlFilter: rule.from, resourceTypes: ["main_frame"] },
          };
          newRules.push(newRule);
        }
      }
      chrome.declarativeNetRequest.updateDynamicRules({ addRules: newRules });
      console.log(newRules);
      return newRules;
    },
  },
  methods: {
    updateSettings: function () {
      this.validateActive();
      chrome.storage.local.set({ rules: this.rules }, function () {
        console.log("new rules " + this.rules);
      });
    },
    addRule: function () {
      this.rules.push({ from: "", to: "", isActive: false });
      this.focusLatest();
    },
    removeRule: function (index) {
      this.rules.splice(index, 1);
      this.updateSettings();
    },
    resetSettings: function () {
      this.rules = [{ from: "", to: "", isActive: false }];
      this.updateSettings();
    },
    validateActive: function () {
      for (let x = 0; x < this.rules.length; x++) {
        if (this.validRules[x] && this.rules[x].isActive) {
          this.rules[x].isActive = true;
        } else {
          this.rules[x].isActive = false;
        }
      }
    },
    checkError: function (index, element) {
      if (!this.validRules[index] && element) {
        let ruleElement = document.querySelectorAll(".rule")[index];
        ruleElement.classList.add("error");
        element.classList.add("error");
        console.log(element);
        setTimeout(function () {
          element.classList.remove("error");
          ruleElement.classList.remove("error");
        }, 2000);
      }
    },
    focusLatest: function () {
      this.$nextTick(() => {
        let inputs = document.querySelectorAll(".rule-from");
        inputs[inputs.length - 1].focus();
      });
    },
  },

  created() {
    let rules = [{ from: "", to: "", isActive: false }],
      vue = this,
      storedValue;
    chrome.storage.local.get(["rules"], function (result) {
      storedValue = result.rules;
      if (typeof storedValue != "undefined") {
        rules = storedValue;
      } else {
        chrome.storage.local.set({ rules: rules }, function () {});
      }
      vue.rules = rules;
    });
  },

  beforeUnmount() {
    chrome.storage.local.set({ rules: rules }, function () {
      console.log("on unmount, rules is set to " + rules);
    });
  },
};
</script>

<style scoped>
#top {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}
button {
  background-color: #232528;
  color: #f4f4f4;
  border: 1px solid #47494c;
  border-radius: 3px;
}
#buttons {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}
#buttons button {
  width: 33%;
  padding: 3px 5px;
}
#rules-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
#rules-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.rule {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  gap: 3px;
  font-size: 80%;
}
.rule.error:not(.valid) > input.rule-from {
  border-color: rgb(110, 0, 0);
}

.check-error-box:before {
  content: "";
  visibility: hidden;
}

.check-error-box.error:before {
  visibility: visible;
  content: 'Error: "from" field is not valid';
  display: block;
  position: relative;
  visibility: visible;
  top: -28px;
  left: 5px;
  border: 1px solid #47494c;
  background-color: rgb(110, 0, 0);
  color: #f4f4f4;
  padding: 3px;
  font-size: 80%;
  width: 100px;
}

.check-error-box {
  display: none;
  position: absolute;
  left: 48px;
  width: 13px;
  height: 13px;
  z-index: 2;
}

.check-error-box.visible {
  display: block;
}

.rule-num {
  min-width: 21px;
  max-width: 21px;
  text-align: right;
}
input {
  border: 2px solid #47494c;
  border-radius: 3px;
}
.hidden {
  display: none;
}

.label {
  font-weight: 500;
}
</style>
