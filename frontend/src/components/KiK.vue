<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
  <br>
  <div class="menu">
    <input type="button" class="button" value="Dołącz do gry" v-on:click="this.join"/>
    <input type="button" class="button" value="START" v-on:click="this.startGame"/>
    <input type="button" class="button" value="Wyjdź z pokoju" v-on:click="this.leave"/>
  </div>
  <br><br>
  <div v-if="loading">
    <div>
      <table>
        <tr>
          <td id="00">{{ values[0] }}</td>
          <td id="11" class="vert">{{ values[1] }}</td>
          <td id="22">{{ values[2] }}</td>
        </tr>
        <tr>
          <td id="33" class="hori">{{ values[3] }}</td>
          <td id="44" class="vert hori">{{ values[4] }}</td>
          <td id="55" class="hori">{{ values[5] }}</td>
        </tr>
        <tr>
          <td id="66">{{ values[6] }}</td>
          <td id="77" class="vert">{{ values[7] }}</td>
          <td id="88">{{ values[8] }}</td>
        </tr>
      </table>
    </div>
  </div>
  <div v-else>
    <div>
      <table>
        <tr>
          <td id="0" v-on:click="this.clickHandler">{{ values[0] }}</td>
          <td id="1" v-on:click="this.clickHandler" class="vert">{{ values[1] }}</td>
          <td id="2" v-on:click="this.clickHandler">{{ values[2] }}</td>
        </tr>
        <tr>
          <td id="3" v-on:click="this.clickHandler" class="hori">{{ values[3] }}</td>
          <td id="4" v-on:click="this.clickHandler" class="vert hori">{{ values[4] }}</td>
          <td id="5" v-on:click="this.clickHandler" class="hori">{{ values[5] }}</td>
        </tr>
        <tr>
          <td id="6" v-on:click="this.clickHandler">{{ values[6] }}</td>
          <td id="7" v-on:click="this.clickHandler" class="vert">{{ values[7] }}</td>
          <td id="8" v-on:click="this.clickHandler">{{ values[8] }}</td>
        </tr>
      </table>
    </div>
  </div>
  <br>
  <div>
    <input v-model="user_id" placeholder="edit me">
    <p>ID is: {{ user_id }}</p>
  </div>
  <div>
    <p>{{ messageFromBackend }}</p>
    <p>{{ error }}</p>
  </div>
</template>

<script>

import { get, post } from "../fetchUtils";
import { getSocket } from "../socketUtils";
import { defineComponent } from "vue";

export default defineComponent({

  data() {
    return {
      msg: null,
      values: [null, null, null, null, null, null, null, null, null],
      user_id: 0,
      state: null,
      error: null,
      loading: true,
      moveValue: null,
      field_id: null,
      users: [],
      firstState: false,
      messageFromBackend: null,
      socket: null,
    };
  },

  created() {
    this.msg = 'Kółko i krzyżyk gra';
    this.getState();
    this.firstState = true;
  },

  watch: {
    '$route': 'fetchData'
  },

  methods: {
    async getState() {
      this.error = this.state = null
      this.loading = true
      const gameId = this.$route.params.id
      await get('http://localhost:3000/kik/' + gameId + '/state')
          .then(response => response.json())
          .then(data => {
            if(data.status === "error"){
              this.error = data.error
            } else {
              this.state = data.gameState
            }
          })
          .catch(err => err => console.error(err))
      this.loading = false
      this.endGameInfo()
      this.state.board.map((field, index) => {
        if (field === 0) {
          this.values[index] = null
        } else if (field === 1) {
          this.values[index] = 'X'
        } else {
          this.values[index] = 'O'
        }
      })
    },

    async join() {
      this.error = null
      this.users = []
      const gameId = this.$route.params.id
      await get('http://localhost:3000/kik/' + gameId + '/join')
          .then(response => response.json())
          .then(data => {
            if(data.status === "error"){
              this.error = data.error
            } else {
              this.users = data.userIds
              this.socket = getSocket('tic-tac-toe', gameId);
              this.initListeners();
            }
          })
          .catch(err => console.error((err)))
      console.log(this.users)
    },

    initListeners() {
      this.socket.on('gameStarted', () => {
        console.log("Starting game!");
      })
    },

    async leave() {
      this.error = null
      const gameId = this.$route.params.id
      await get('http://localhost:3000/kik/' + gameId + '/leave')
          .then(response => response.json())
          .catch(err => console.error(err))
    },

    async startGame() {
      this.error = null
      const gameId = this.$route.params.id
      this.socket.emit('gameStart', gameId);
      await get('http://localhost:3000/kik/' + gameId + '/ready')
          .then(response => response.json())
          .catch(err => console.error(err))
    },

    async makeMove() {
      this.error = this.moveValue = null
      const gameId = this.$route.params.id
      await post('http://localhost:3000/kik/' + gameId + '/make_move', {
        playerId: parseInt(this.user_id),
        move: this.field_id
      })
          .then(response => response.json())
          .then(data => {
            if(data.status === "error"){
              this.error = data.error
            }
          })
          .catch(err => err => console.error(err))
      console.log(this.user_id)
      console.log(this.field_id)
    },

    async getInfo() {

    },

    endGameInfo() {
      console.log(this.state.winner)
      if(this.state.winner !== null){
        this.messageFromBackend = "Wygrał gracz: " + this.state.winner + "!"
      }
      if(this.state.tied){
        this.messageFromBackend = "REMIS!"
      }
    },

    clickHandler(event) {
      if (this.values[event.target.id] !== null) {
        console.log("pole zajęte")
      } else {
        this.field_id = event.target.id
        this.makeMove()
      }
    }
  }
});

</script>

<style>

td {
  width: 100px;
  height: 100px;
}

table {
  margin: 5px auto;
}

.vert {
  border-left: 2px solid black;
  border-right: 2px solid black;
}

.hori {
  border-top: 2px solid black;
  border-bottom: 2px solid black;
}

.menu {
  /*margin-left: 500px;*/
}

.button {
  margin-left: 50px;
}
</style>
