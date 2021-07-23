<template>
  <TheHeader/>
  <router-view/>
  <TheFooter/>
</template>

<script>
import {defineComponent} from 'vue';
import Home from './components/Home.vue';
import TheFooter from "./components/TheFooter.vue";
import TheHeader from "./components/TheHeader.vue";

export default defineComponent({
  name: 'App',
  components: {
    TheHeader,
    TheFooter,
    Home,
  }
})
</script>
