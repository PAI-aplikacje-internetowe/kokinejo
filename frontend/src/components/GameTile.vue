<template>
  <div class="tile is-child">
    <div class="card">

      <div class="card-image">
        <figure class="image is-4by3">
          <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
        </figure>
      </div>

      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4 is-uppercase">{{ gameName }}</p>
          </div>
        </div>

        <div class="content">
          Here is a short description of the game.
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </div>
      </div>

      <footer class="card-footer">
        <!--        <a class="card-footer-item play-button has-text-primary has-text-weight-bold">Play</a>-->
        <router-link
            :to="{ name: playRouteName }"
            class="card-footer-item play-button has-text-primary has-text-weight-bold"
        >
          Play
        </router-link>
        <router-link
            :to="{ name: moreRouteName }"
            class="card-footer-item has-text-black"
        >
          More
        </router-link>
      </footer>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";

export default defineComponent({
  name: 'GameTile',
  props: ['gameName'],
  data() {
    return {
      playRouteName: "",
      moreRouteName: "",
    }
  }
})

</script>
