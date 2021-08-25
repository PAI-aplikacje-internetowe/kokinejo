<template>
  <section class="section">
    <h1 class="title">TIC-TAC-TOE</h1>
    <h2
        v-if="users"
        class="subtitle"
    >
      <p>Players: {{ userList }}</p>
      <p>MyId: {{ this.$store.state.myId }}</p>
    </h2>
    <div class="menu">
      <div class="buttons">

        <input v-if="joined" disabled type="button" class="button is-success" value="Joined"/>
        <input v-else-if="areFreeSeats" type="button" class="button" value="Join game" v-on:click="this.join"/>
        <input v-else disabled type="button" class="button" value="Join"/>

        <input v-if="canStart" type="button" class="button" value="Start" v-on:click="this.startGame"/>
        <input v-else-if="started" disabled type="button" class="button is-success" value="Started"/>
        <input v-else disabled type="button" class="button" value="Start"/>

        <input v-if="joined" type="button" class="button" value="Leave" v-on:click="this.leave"/>
        <input v-else disabled type="button" class="button" value="Leave"/>
      </div>
    </div>
    <br><br>
    <div id="loader" class="pageloader is-active"><span class="title">Loading game</span></div>
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

    <div id="winner-modal" class="modal">
      <div class="modal-background" v-on:click="this.closeWinnerModal"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">We have a winner!</p>
          <button class="delete" aria-label="close" v-on:click="this.closeWinnerModal"></button>
        </header>
        <section class="modal-card-body">
          <p>{{ winnerMessage }}</p>
        </section>
      </div>
    </div>

    <br>
  </section>
</template>

<script>

import {get, post} from "../fetchUtils";
import {getSocket} from "../socketUtils";
import {defineComponent, inject} from "vue";

export default defineComponent({
  props: ['minPlayers', 'maxPlayers'],

  data() {
    return {
      values: [null, null, null, null, null, null, null, null, null],
      state: null,
      error: null,
      moveValue: null,
      field_id: null,
      users: [],
      messageFromBackend: null,
      socket: null,

      gameId: this.$route.params.id,
      started: false,
      gameEndpoint: '',
      winnerId: null,
    };
  },

  computed: {
    userList() {
      // not present users are nulls
      const presentUsers = this.users.filter(Boolean);
      if (presentUsers.length > 0) {
        return presentUsers.join(', ');
      } else {
        return "none yet"
      }
    },
    canStart() {
      const usersJoined = this.users.filter(Boolean);
      const myId = this.$store.state.myId;
      return !this.started
          && usersJoined.indexOf(myId) !== -1
          && usersJoined.length >= this.minPlayers
    },
    areFreeSeats() {
      const usersJoined = this.users.filter(Boolean).length;
      return usersJoined < this.maxPlayers;
    },
    joined() {
      const usersJoined = this.users.filter(Boolean);
      const myId = this.$store.state.myId;
      return usersJoined.indexOf(myId) !== -1;
    },
    winnerMessage() {
      if (this.winnerId === this.$store.state.myId) {
        return "You have won! Congratulations!";
      } else {
        return `User with id ${this.winnerId} have one. Good luck next time!`;
      }
    }
  },

  created() {
    this.gameEndpoint = inject('ENDPOINT_KIK');
    this.getState();
    this.socket = getSocket('tic-tac-toe', this.gameId);
    this.initListeners();
  },

  watch: {
    state(newState, _) {
      this.started = newState.started;
      if (newState.winner) {
        this.winnerId = newState.winner;
        this.endGameInfo(newState.winner);
      }
    }
  },

  methods: {
    url(endpoint) {
      return this.gameEndpoint + '/' + this.gameId + endpoint;
    },

    async getState() {
      this.error = null
      await get(this.url('/state'))
          .then(response => response.json())
          .then(data => {
            if (data.status === "error") {
              this.error = data.error
            } else {
              this.state = data.gameState
              this.users = data.userIds;
            }
          })
          .catch(err => err => console.error(err))
      this.hideLoader();
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

    hideLoader() {
      const loader = document.getElementById('loader');
      setTimeout(() => loader.classList.remove('is-active'), 200);
    },

    async join() {
      this.error = null
      await get(this.url('/join'))
          .then(response => response.json())
          .then(data => {
            if (data.status === "error") {
              this.error = data.error
            } else {
              console.log(data);
              this.state = data.gameState;
              this.users = data.userIds;
            }
          })
          .catch(err => console.error((err)))
    },

    initListeners() {
      this.socket.on('gameStarted', async () => {
        await this.getState();
      })

      this.socket.on('pullState', async () => {
        await this.getState();
      })

      this.socket.on('userDisconnected', async (userName) => {
        await this.getState();
      });
    },

    async leave() {
      this.error = null
      await get(this.url('/leave'))
          .then(response => response.json())
          .then(data => {
            if (data.status === "error") {
              this.error = data.error
            } else {
              this.state = data.gameState;
              this.users = data.userIds;
            }
          })
          .catch(err => console.error(err))
    },

    async startGame() {
      this.error = null
      this.started = true;
      await get(this.url('/ready'))
          .then(response => response.json())
          .then(data => {
            if (data.status === "error") {
              this.error = data.error
            } else {
              this.state = data.gameState;
              this.users = data.userIds;
            }
          })
          .catch(err => console.error(err))
    },

    async makeMove(fieldId) {
      this.error = this.moveValue = null
      this.socket.emit("move", {
        gameId: this.gameId,
        fieldId: fieldId,
      });
    },

    endGameInfo() {
      const winnerModal = document.getElementById('winner-modal');
      winnerModal.classList.add('is-active');
    },

    closeWinnerModal() {
      const winnerModal = document.getElementById('winner-modal');
      winnerModal.classList.remove('is-active');
    },

    clickHandler(event) {
      const field_id = event.target.id;
      if (this.values[field_id] === null) {
        this.makeMove(field_id)
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
  width: 100px;
}
</style>
