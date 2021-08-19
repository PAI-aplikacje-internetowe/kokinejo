<template>
  <p v-if="loading">Loading...</p>
  <p v-else>Crazy Eights!</p>
<!--  <div>-->
<!--    <input v-model="user_id" placeholder="edit me">-->
<!--    <p>ID is: {{ user_id }}</p>-->
<!--  </div>-->
</template>

<script>

export default {

  data() {
    return {
      loading: true,
    };
  },

  created() {
    console.log("Crazy eights created!")
  },

  watch: {
    // co to jest?
    '$route': 'fetchData'
  },

  methods: {
    async join() {
      this.error = null
      this.users = []
      const gameId = this.$route.params.id
      await fetch('http://localhost:3000/kik/' + gameId + '/join?userId=' + this.user_id)
          .then(response => response.json())
          .then(data => {
            if(data.status === "error"){
              this.error = data.error
            } else {
              this.users = data.userIds
            }
          })
          .catch(err => console.error((err)))
      console.log(this.users)
    },

    async leave() {
      this.error = null
      const gameId = this.$route.params.id
      await fetch('http://localhost:3000/kik/' + gameId + '/leave?userId=' + this.user_id)
          .then(response => response.json())
          .catch(err => console.error(err))
    },

    async startGame() {
      this.error = null
      const gameId = this.$route.params.id
      await fetch('http://localhost:3000/kik/' + gameId + '/ready')
          .then(response => response.json())
          .catch(err => console.error(err))
    },

    async makeMove() {
      this.error = this.moveValue = null
      const gameId = this.$route.params.id
      await fetch('http://localhost:3000/kik/' + gameId + '/make_move', {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'origin-list',
        },
        body: JSON.stringify({playerId: parseInt(this.user_id), move: this.field_id})
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
};

</script>
