
(function(){
  var isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
  var modal = document.getElementById('ios-install-modal');
  if (modal) {
    var iosGuide = document.getElementById('ios-guide');
    var andGuide = document.getElementById('android-guide');
    if (isIos) {
      if(iosGuide) iosGuide.style.display = 'block';
    } else {
      if(andGuide) andGuide.style.display = 'block';
    }
  }
})();
