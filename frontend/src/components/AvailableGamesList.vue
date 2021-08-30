<template>
  <section class="section">
    <div class="container">

      <h1 class="title is-uppercase">{{ gameName }}</h1>

      <ul class="block-list">
        <template v-for="game in gameLists">
          <router-link :to="$route.path + '/game/' + game.id">
            <li
                class="is-flex has-text-black is-outlined"
                @mouseenter="toggleHighlight"
                @mouseleave="toggleHighlight"
            >
              <div style="width: 100px">
                #{{ game.id }}
              </div>
              <div style="width: 150px">
                {{ occupiedSeats(game.players) }}
              </div>
              <div class="is-flex-grow-1 has-text-weight-semibold">
                {{ game.players }}
              </div>
            </li>
          </router-link>
        </template>
      </ul>

    </div>
  </section>
</template>


<script>
import {defineComponent, inject} from "vue";
import {get} from "../fetchUtils";

export default defineComponent({
  props: ['gameName', 'endpointKey'],
  methods: {
    occupiedSeats(players) {
      const countPlayers = () => {
        if (players === "") return 0;
        let playersCount = players.split(',').length;
        if (playersCount === 0) return 1;
        return playersCount;
      }
      return `${countPlayers()} / ${this.maxPlayers}`;
    },
    toggleHighlight(e) {
      e.target.classList.toggle('is-highlighted');
      e.target.classList.toggle('is-primary');
    },
    loadAvailableGames() {
      get(this.endpoint)
          .then(response => response.json())
          .then(data => {
            this.gameLists = data.availableGames;
            this.maxPlayers = data.maxPlayers;
          })
          .catch(err => console.error(err));
      this.timeoutId = setTimeout(this.loadAvailableGames, 1000);
    }
  },
  data() {
    return {
      gameLists: [],
      maxPlayers: 0,
      endpoint: '',
      timeoutId: 0,
    };
  },
  created() {
    this.endpoint = inject(this.endpointKey);
    this.loadAvailableGames();
  },
  unmounted() {
    clearTimeout(this.timeoutId);
  }
});

</script>
