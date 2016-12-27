var socket = io();


// register modal component
Vue.component('modal', {
    template: '#modal-template',
    props: {
        show: {
            type: Boolean,
            required: true,
            twoWay: true
        }
    }
})

var vm = new Vue({
    el: "#chat",
    data: {
        showModal: true,
        username: null,
        messages: [],
        users: [],
        input: "",
        menuVisible: true
    },
    methods: {
        toggleMenu: function (e) {
            if (window.innerWidth <= 480) {
                this.menuVisible = !this.menuVisible;
            }
        },
        addUser: function (e) {
            if (!this.username)
                return;
            this.users.push(this.username);
            socket.emit('join chat', this.username);
            vm.showModal = false;

        },
        sendMessage: function (e) {
            // Make sure there is input
            if (!this.input)
                return;

            // Update messages           
            this.messages.push({
                author: this.username,
                text: this.input,
            });

            socket.emit('send message', this.input);

            // Clear input for next message
            this.input = '';
        }
    }
});

socket.on('users', function (users) {
    vm.users = users;
});

socket.on('chat message', function (msg) {
    vm.messages.push(msg);
});

socket.on('user joined', function (username) {
    vm.users.push(username);
});


socket.on('user left', function (username) {
    var index = vm.users.indexOf(username);
    vm.users.splice(index, 1);
});
