import React, { useEffect } from "react";

export const ClapprPlayer = (props) => {

  useEffect(() => {
    dynamicallyImportPackage()
  }, [])

  let dynamicallyImportPackage = async () => {
    const metadata = await fetch(`http://${self.location.hostname}:5000`  + props.metadata);
    const video = await metadata.json();
    const ClapprThumbnailsPlugin = (await import('clappr-thumbnails-plugin')).default;
    const Clappr = (await import('clappr')).default;    

    document.title = video.title;
    var playerElement = document.getElementById("player");

    const thumbs = video.previews.sort().map((preview, i) => {
      return {time: ((i+1) * 20), url:`http://${self.location.hostname}:5000` + preview }
    });

    let player = null;
    player = new Clappr.Player({
      plugins: {
        core: [ClapprThumbnailsPlugin],
      },
      poster:`http://${self.location.hostname}:5000` + video.thumbnail,
      baseUrl: `http://${self.location.hostname}:3000`,
      source: `http://${self.location.hostname}:5000` + video.filename,
      autoPlay: false,
      // width: "500px",
      // height: "300px",
      scrubThumbnails: {
        backdropHeight: 64,
        spotlightHeight: 84,
        thumbs: thumbs
      },
      events: {
        onError: function(e) {
          // Here the code to handle the error
        }
      }
    });
    player.attachTo(playerElement);
  }

  return (
      <div id="player" ></div>
  );
};