<template>
  <header id="the-header">
    <nav id="navbar" class="navbar is-primary" role="navigation">
      <div class="navbar-brand">
        <router-link :to="{name: 'home'}" class="navbar-item" id="navbar-logo">
          <img src="./../assets/Kokinejo-logos_horizontal.jpeg" alt="Kokinejo logo" height="100">
        </router-link>

        <a
            role="button"
            class="navbar-burger"
            :class="{'is-active': menuIsActive}"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbar-menu"
            @click="toggleBurgerMenu"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar-menu" class="navbar-menu" :class="{'is-active': menuIsActive}">
        <div class="navbar-start">
          <router-link :to="{name: 'home'}" class="navbar-item">
            <strong>Games</strong>
          </router-link>
          <a class="navbar-item">
            <strong>About</strong>
          </a>
          <a class="navbar-item"
             @click="commitIncrement"
          >
            {{ count }}
          </a>

          <div class="field has-addons navbar-item">
            <div class="control">
              <input class="input" type="text" :placeholder="loadToken" v-model="tokenInput">
            </div>
            <div class="control">
              <a
                  class="button is-info"
                  @click="setToken"
              >
                Set token
              </a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-dark">
                Sign up
              </a>
              <a class="button">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'TheHeader',
  data() {
    return {
      menuIsActive: false,
      tokenInput: '',
    }
  },
  computed: {
    count() {
      return this.$store.state.count;
    },
    loadToken() {
      const token = this.$store.state.token;
      return token || 'Token';
    }
  },
  methods: {
    toggleBurgerMenu(event) {
      if (event) {
        this.menuIsActive = !this.menuIsActive;
      }
    },
    commitIncrement() {
      this.$store.commit('increment');
    },
    setToken() {
      this.$store.commit('setToken', this.tokenInput);
    },
  }
})
</script>
