var socket = io();

var vm = new Vue({
  el: "#chat",
  data: {
    messages: [],
    input: ""
  },
  methods: {
    typing: function(e) {

    },
    post: function(e) {
      if (!this.input)
        return;
      var message = this.input;
      this.input = '';
      this.messages.push(message);
      socket.emit('chat message', message);
      e.preventDefault();
    }
  }
});

socket.on('chat message', function(msg){
  console.log('pushing message');
  vm.messages.push(msg);
});