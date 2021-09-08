<template>
  <APIProvider>
    <TheHeader/>
    <router-view/>
    <TheFooter/>
  </APIProvider>
</template>

<script>
import {defineComponent} from 'vue';
import APIProvider from './components/APIProvider.vue';
import Home from './components/Home.vue';
import TheFooter from "./components/TheFooter.vue";
import TheHeader from "./components/TheHeader.vue";

export default defineComponent({
  name: 'App',
  components: {
    APIProvider,
    TheHeader,
    TheFooter,
    Home,
  }
})
</script>
