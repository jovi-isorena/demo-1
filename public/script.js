const socket = io("/");
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
    host: '/',
    port: '3001'
});

const myVideo = document.createElement('video');
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(
    stream => {
        addVideoStream(myVideo, stream);

        myPeer.on('call', call => {
            call.answer(stream);
            const video = document.createElement('video');
            call.on('stream', userVideoStream => {
                addVideoStream(video, userVideoStream)
            })
        })

        socket.on('user-connected', userid =>{
            connectedToNewUser(userid, stream)
        })
    }
)

myPeer.on('open', id=>{
    socket.emit('join-room', ROOM_ID, id);
})

socket.on('user-disconnected', userid => {
    if(peers[userid]) peers[userid].close();
})

function connectedToNewUser(userid, stream){
    const call = myPeer.call(userid, stream);
    const video = document.createElement('video');
    call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
    });
    call.on('close', ()=>{
        video.remove();
    })

    peers[userid] = call;
}
function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', ()=>{
        video.play();

    })
    videoGrid.append(video);
}