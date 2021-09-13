<template>
  <div class="column is-one-third">
    <div class="card">

      <div class="card-image">
        <figure class="image is-4by3">
          <img :src="picture" alt="Placeholder image" style="overflow: hidden">
        </figure>
      </div>

      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4 is-uppercase">{{ gameName }}</p>
          </div>
        </div>

        <div class="content" style="height: 2rem">
          <p>{{ description }}</p>
        </div>
      </div>

      <footer class="card-footer">
        <router-link
            :to="{ name: playRoute }"
            class="card-footer-item play-button has-text-primary has-text-weight-bold"
        >
          Play
        </router-link>
        <a
            @click="toggleInfo"
            class="card-footer-item has-text-black is-warning"
        >
          More
        </a>
      </footer>

      <GameInfoModal
          :active="infoIsActive"
          :gameName="gameName"
          :description="description"
          @info-close="toggleInfo"
      />
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import GameInfoModal from "./GameInfoModal.vue";

export default defineComponent({
  name: 'GameTile',
  components: {GameInfoModal},
  props: ['gameName', 'playRoute', 'picture', 'description'],
  data() {
    return {
      infoIsActive: false,
      picture: this.$props.picture || "https://bulma.io/images/placeholders/1280x960.png",
      description: this.$props.description || "Here is a short description of the game. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    }
  },
  methods: {
    toggleInfo() {
      this.infoIsActive = !this.infoIsActive;

      document.documentElement.classList.toggle('is-clipped');
      // to prevent from scrolling background when modal is opened
    }
  }
})

</script>
