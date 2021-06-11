<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
  <div v-if="loading">LOADING...</div>
  <div v-else>
    <div>
      <table>
        <tr>
          <td id="0" v-on:click="clickHandler">{{ values[0] }}</td>
          <td id="1" v-on:click="clickHandler" class="vert">{{ values[1] }}</td>
          <td id="2" v-on:click="clickHandler">{{ values[2] }}</td>
        </tr>
        <tr>
          <td id="3" v-on:click="clickHandler" class="hori">{{ values[3] }}</td>
          <td id="4" v-on:click="clickHandler" class="vert hori">{{ values[4] }}</td>
          <td id="5" v-on:click="clickHandler" class="hori">{{ values[5] }}</td>
        </tr>
        <tr>
          <td id="6" v-on:click="clickHandler">{{ values[6] }}</td>
          <td id="7" v-on:click="clickHandler" class="vert">{{ values[7] }}</td>
          <td id="8" v-on:click="clickHandler">{{ values[8] }}</td>
        </tr>
      </table>
    </div>
  </div>
  <div>
    <input v-model="user_id" placeholder="edit me">
    <p>ID is: {{ user_id }}</p>
  </div>
</template>

<script>

export default {

  data() {
    return {
      msg: null,
      values: [null, null, null, null, null, null, null, null, null],
      move: 0,
      user_id: 0,
      state: null,
      error: null,
      loading: true,
      clickHandler: clickHandler
    };
  },

  created() {
    this.msg = 'Kółko i krzyżyk gra';
    this.getState()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    async getState() {
      this.error = this.state = null
      this.loading = true
      const gameId = this.$route.params.id
      await fetch('http://localhost:3000/kik/' + gameId + '/state')
          .then(response => response.json())
          .then(data => {
            this.state = data.gameState
            console.log(this.state.board)
          })
          .catch(err => console.error((err)))
      this.loading = false
      this.state.board.map((field, index) => {
        if (field === 0) {
          this.values[index] = null
        } else if (field === 1) {
          this.values[index] = 'X'
        } else {
          this.values[index] = 'O'
        }
      })
      console.log(this.state)
    }
  }
};

function clickHandler(event) {
  if (this.values[event.target.id] !== null) {
    console.log("pole zajęte")
  } else {
    if (this.move % 2 === 0) {
      this.values[event.target.id] = "X"
    } else {
      this.values[event.target.id] = "O"
    }
    this.move++
  }
}

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
</style>