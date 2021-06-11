<template>
  <div>
    <h1>Dostępne gry:</h1>
    <div>
      <ul>
        <li v-for="(item, index) in gameLists">
          <router-link :to="{ name: 'game', params: {id: item.id }}">gra nr {{ item.id }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gameLists: [],
      emptySeats: emptySeats,
    };
  },
  created() {
    fetch('http://localhost:3000/kik/available_games')
        .then(response => response.json())
        .then(data => (this.gameLists = data.availableGames))
        .catch(err => console.error(err));
  }
};

function emptySeats(event){
  var count = 0
  if(event.target.item.userIds !== null){
    count++
  }
  return count
}
</script>

<style scoped>

</style>