<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
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
</template>

<script>
export default {

  data() {
    return {
      msg: null,
      values: [null,null,null,null,null,null,null,null,null],
      move: 0,
      clickHandler: clickHandler
    };
  },
  created() {
    this.msg = 'Kółko i krzyżyk gra';
  },
};

function clickHandler(event) {
  if(this.values[event.target.id] !== null){
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