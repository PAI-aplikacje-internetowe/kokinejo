<template>
  <h1>{{ msg }}</h1>
  <div>
    <router-link to='/kik'>Kółko i krzyżyk</router-link>
  </div>
  <router-view></router-view>
</template>

<script>
export default {

  name: "get-request",
  data() {
    return {
      msg: null
    };
  },
  created() {
    fetch('http://localhost:3000/')
        .then(response => response.json())
        .then(data => (this.msg = data.powitanie))
        .catch(err => console.error(err));
  }
};
</script>
