/** The core Vue instance controlling the UI */
const vm = new Vue ({
  el: '#vue-instance',
  data () {
    return {
      cryptWorker: null,
      socket: null,
      originPublicKey: null,
      destinationPublicKey: null,
      messages: [],
      notifications: [],
      currentRoom: null,
      pendingRoom: Math.floor(Math.random() * 1000),
      draft: ''
    }
  },
  created () {
    // Initialize socket.io
    this.socket = io()
    this.setupSocketListeners()
  },
  methods: {

    /** Setup Socket.io event listeners */

    setupSocketListeners() {
      // Auto join default rooms on connect
      this.socket.on('connect', ()=>{
        this.addNotification('Connected To Server')
        this.joinRoom()
      })

      //Notify user that they have lost the socket connection
      this.socket.on('disconnect', () => this.addNotification('Lost Connection'))

      // Dispaly message when recieved
      this.socket.on('MESSAGE', (message) => 
        {this.addMessage(message)
      })
    },

    /** Send the current draft message */
    sendMessage(){
      // Do not send message if there is nothing to send
      if (!this.draft || this.draft == '') {
        return
      }

      const message = this.draft

      this.draft = '' // Reset UI input
      this.addMessage(message)
      this.socket.emit('MESSAGE', message)
    },

    /*** Join the chatroom*/
    joinRoom (){
      this.socket.emit('JOIN')
    },

    addMessage(message){
      this.messages.push(message)
    },

    /** Append a notification message in the UI */
    addNotification (message) {
      const timestamp = new Date().toLocaleTimeString()
      this.notifications.push({ message, timestamp })
    },
  }
})