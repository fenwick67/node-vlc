var vlc = require('../vlc')([
  '-I', 'dummy',
  //'-V', 'dummy',
  '--verbose', '1',
  '--no-video-title-show',
  '--disable-screensaver',
  '--no-snapshot-preview',
  '--video-wallpaper'
]);

var media = vlc.mediaFromFile(process.argv[2]);
media.parseSync();

media.track_info.forEach(function (info) {
  console.log(info);
});

console.log(media.artist, '--', media.album, '--', media.title);

var player = vlc.mediaplayer;
player.fullscreen=true;
player.media = media;

player.play();
var POS = 0.9
player.position = POS;

var poller = setInterval(function () {
  console.log('Poll:', player.position);

  try {      
    /*
    if (player.position >=.9999){
      tearDown();
    }
    */
    if (player.video.track_count > 0) {
      player.toggle_fullscreen();
    }
  } catch (e) {
    console.log('caught error',e);
  }
}, 500);

console.log('Media duration:', media.duration);

player.on('EndReached',function(){
  tearDown();
})
player.on('Stopped',function(){
  tearDown();
});


function tearDown() {
  console.log('--- stopping ---', player.position);
  player.stop();
  media.release();
  vlc.release();
  clearInterval(poller);
}