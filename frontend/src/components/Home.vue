<template>
  <section id="home-section" class="section is-align-self-center">
    <h1 class="title has-text-centered">Welcome to Kokinejo</h1>
    <h2 class="subtitle has-text-centered">Choose your game and play</h2>

    <div class="box">
      <div class="columns is-multiline">
        <template v-for="game in games">
          <GameTile
              :game-name="game.name"
              :play-route="game.routerName"
              :picture="game.picture"
              :description="game.description"
          />
        </template>
      </div>
    </div>

  </section>
</template>

<script>
import {defineComponent, inject} from "vue";
import GameTile from "./GameTile.vue";

export default defineComponent({
  name: "Home",
  components: {GameTile},
  data() {
    return {
      msg: null,
      games: [
        {
          name: 'Tic-tac-toe',
          routerName: 'kik',
          description: 'Simple singleplayer game',
          picture: "/public/tic-tac-toe.png",
        },
        {
          name: 'Crazy eights',
          routerName: 'crazy-eights',
          description: 'This is a game crazy eights! Try to win with others',
        },
        {
          name: 'Solitaire',
          routerName: 'not-found',
          description: 'This is solitaire',
        },
        {
          name: 'Oczko',
          routerName: 'not-found',
          description: 'The oczko game - this is the best!',
        },
      ]
    };
  },
  created() {
    const url = inject('ENDPOINT_INDEX');
    fetch(url)
        .then(response => response.json())
        .then(data => (this.msg = data.powitanie))
        .catch(err => console.error(err));
  },
});

</script>
