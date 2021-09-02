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
        Rules: {{ rules }}
      </div>
      <div
        v-for="(rule, index) in rules"
        :key="index"
        class="rule"
        :class="{ active: rule.isActive }"
      >
        <span class="rule-label">{{ index + 1 }}.</span>
        <input type="checkbox" v-model="rule.isActive" />
        <span class="rule-label">from</span>
        <input type="text" v-model="rule.from" />
        <span class="rule-label">to</span>
        <input type="text" v-model="rule.to" />
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
      blankRule: { from: "", to: "", isActive: false },
      rules: [{ from: "", to: "", isActive: false }],
    };
  },
  computed: {
    activeRules: function () {
      let activeList = [];
      for (let x = 0; x < this.rules.length; x++) {
        console.log(x);
        if (this.rules[x].isActive) {
          activeList.push(x);
        }
      }
      return activeList;
    },
  },
  methods: {
    updateSettings: function () {
      let vue = this;
      chrome.extension.sendMessage({
        update: true,
        rules: vue.rules,
        activeRules: vue.activeRules,
      });
    },
    addRule: function () {
      this.rules.push({ from: "", to: "", isActive: false });
    },
    removeRule: function (index) {
      this.rules.splice(index, 1);
    },
    resetSettings: function () {
      this.rules = [{ from: "", to: "", isActive: false }];
      //this.updateSettings();
    },
  },

  created() {
    var vue = this;
    chrome.extension.sendMessage(
      {
        onLoad: true,
      },
      function (response) {
        console.log("onload");
        vue.rules = response.currentRules;
        alert("rules: ", vue.rules);
      }
    );
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
  width: 25%;
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
input {
  border: 1px solid #47494c;
  border-radius: 3px;
}
.hidden {
  display: none;
}

.label {
  font-weight: 500;
}
</style>
