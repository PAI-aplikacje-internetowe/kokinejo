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
        </div>

        <div class="navbar-end">

          <template v-if="isLoggedIn">
            <p class="navbar-item">Nick: {{ myName }}</p>
            <div class="buttons navbar-item">
              <a class="button is-dark"
                 @click="logOut"
              >
                Log out
              </a>
            </div>
          </template>

          <template v-else>
            <div class="navbar-item">
              <div class="buttons">
                <a class="button is-dark"
                   @click="goToSignup"
                >
                  Sign up
                </a>
                <a class="button"
                   @click="goToLogin"
                >
                  Log in
                </a>
                <!--              <Login />-->
              </div>
            </div>
          </template>

        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import {defineComponent, inject} from "vue";
import {get} from "../fetchUtils";
import Login from '../components/Login.vue';
import {useRouter} from "vue-router";

export default defineComponent({
  name: 'TheHeader',
  components: {
    Login,
  },
  data() {
    return {
      menuIsActive: false,
      tokenInput: '',
      endpointAuthMe: '',
      endpointLogOut: '',
      router: undefined,
    }
  },
  created() {
    this.endpointAuthMe = inject('ENDPOINT_AUTH_ME');
    this.endpointLogOut = inject('ENDPOINT_LOGOUT');
    this.router = useRouter();
  },
  computed: {
    count() {
      return this.$store.state.count;
    },
    isLoggedIn() {
      return !!this.$store.state.token;
    },
    myName() {
      const userName = this.$store.state.myName;
      return userName || 'not logged in';
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
    goToLogin() {
      this.router.push('/auth/login');
    },
    goToSignup() {
      this.router.push('/auth/signup');
    },

    async logOut() {
      const response = await get(this.endpointLogOut);
      if (response.ok) {
        this.$store.commit('logout');
        await this.router.push('/');
      }
    },
  }
})
</script>
