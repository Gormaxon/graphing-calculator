(function(){
  // Check if we're in an iframe
  var inIframe = false;
  try {
    inIframe = window.self !== window.top;
  } catch (e) {
    inIframe = true; // If we can't access top, we're definitely in a cross-origin iframe
  }

  // If not in iframe, redirect immediately
  if (!inIframe) {
    window.location.replace('about:blank');
  }
})();
