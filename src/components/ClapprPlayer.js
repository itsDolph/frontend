import React, { useEffect } from "react";
// import Clappr from "clappr";
import ClapprThumbnailsPlugin from 'clappr-thumbnails-plugin'

export const ClapprPlayer = (props) => {

  useEffect(() => {
    dynamicallyImportPackage()
  }, [])

//   useEffect(() => {
//     let player = null;
//     player = new Clappr.Player({
//       parentId: `#${id}`,
//       source: source,
//       autoPlay: false,
//       width: "100%",
//       height: "300px",
//     });
//     return () => {
//       player.destroy();
//       player = null;
//     };
//   }, []);

  let dynamicallyImportPackage = async () => {
    const metadata = await fetch("http://127.0.0.1:5000"  + props.metadata);
    const video = await metadata.json();
    const Clappr = await import('clappr');
    // const ClapprThumbnailsPlugin = await import('clappr-thumbnails-plugin');
    // you can now use the package in here

    document.title = video.title;
    var playerElement = document.getElementById("player");

    const thumbs = video.previews.sort().map((preview, i) => {
      return {time: ((i+1) * 20), url:"http://127.0.0.1:5000" + preview }
    });


    let player = null;
    player = new Clappr.Player({
    //   parentId: `${id}`,
      plugins: {
        core: [ClapprThumbnailsPlugin]
      },
      baseUrl: "http://localhost:3000/",
      source: "http://127.0.0.1:5000" + video.filename,
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