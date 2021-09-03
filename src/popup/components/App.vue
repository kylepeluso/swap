<template>
  <div id="app">
    <appHeader></appHeader>
    <rules></rules>
  </div>
</template>

<script>
import appHeader from "./Header";
import rules from "./Rules";

export default {
  name: "App",
  components: { appHeader, rules },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style scoped>
#app {
  width: 465px;
  overflow: hidden;
  background-color: #2a2d30;
  color: #f4f4f4;
  font-size: 1.2em;
  padding: 2px 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>