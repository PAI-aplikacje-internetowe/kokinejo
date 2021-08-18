<template>
  <section id="home-section" class="section is-align-self-center">
    <h1 class="title">Welcome to Kokinejo</h1>
    <h2 class="subtitle">Choose your game and play</h2>

    <div class="box">
      <div class="tile is-ancestor">

<!--        TODO: Generować dynamicznie na podstawie gdzieś zapisanych danych - jak zrobić kolumny?-->
        <div class="tile is-parent is-vertical">
          <GameTile game-name="Kółko i krzyżyk"/>
          <GameTile game-name="Crazy Eights"/>
        </div>

        <div class="tile is-parent is-vertical">
          <GameTile game-name="Oczko"/>
<!--          <GameTile />-->
        </div>

        <div class="tile is-parent is-vertical">
          <GameTile game-name="Pasjans Solitaire"/>
<!--          <GameTile />-->
        </div>
      </div>
    </div>

  </section>
</template>

<script>
import {defineComponent} from "vue";
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
    fetch('http://localhost:3000/')
        .then(response => response.json())
        .then(data => (this.msg = data.powitanie))
        .catch(err => console.error(err));
  },
});

</script>
