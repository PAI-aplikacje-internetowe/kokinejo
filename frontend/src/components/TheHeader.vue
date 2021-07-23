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
          <a class="navbar-item">
            <strong>Games</strong>
          </a>
          <a class="navbar-item">
            <strong>About</strong>
          </a>
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
    }
  },
  methods: {
    toggleBurgerMenu(event) {
      if (event) {
        this.menuIsActive = !this.menuIsActive;
      }
    }
  }
})
</script>
