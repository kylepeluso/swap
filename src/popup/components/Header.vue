<template>
  <div id="header">
    <h1 id="app-title">swap</h1>
  </div>
</template>

<script>
export default {
  name: "appHeader",
};
</script>

<style scoped>
#header {
  border-bottom: 1px solid #47494c;
  padding-bottom: 5px;
}
.header-img {
  height: 30px;
}

#app-title {
  flex-grow: 1;
  text-align: right;
  margin-right: 10px;
  font-size: 150%;
}
</style>