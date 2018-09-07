var getUserMedia = require('getusermedia')
var nodemailer = require('nodemailer')

getUserMedia({ video: true, audio: false }, function (err, stream) {
  if (err) return console.error(err)

  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#init',
    trickle: false,
    stream: stream
  })
  peer.on('signal', function (data) {
    document.getElementById('yourId').value = JSON.stringify(data)
    var sdp = JSON.stringify(data)
    if(!sdp){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'bhargavbhat95@gmail.com',
          pass: '9538183813'
        }
      });
      var gm = document.getElementById('gmail').value
      var mailOptions = {
        from: 'kiran@plivo.com',
        to: gm,
        subject: 'Sending Email using Node.js',
        text: sdp
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    })
  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer.signal(otherId)
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    peer.send(yourMessage)
  })

  peer.on('data', function (data) {
    document.getElementById('Received').textContent += data + '\n'
  })

  peer.on('stream', function (stream) {
    var video = document.createElement('video')
    document.body.appendChild(video)

    video.src = window.URL.createObjectURL(stream)
    video.play()
  }
})
