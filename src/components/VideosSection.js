import React, { useEffect, useState } from "react";
import PageLoader from "components/PageLoader";
import Container from "react-bootstrap/Container";
import SectionHeader from "components/SectionHeader";
import CardDeck from "react-bootstrap/CardDeck";
import VideoCard from "components/VideoCard";
import { useAuth } from "util/auth.js";
import { useRouter } from "next/router";
import Link from "next/link";
import { getVideosList } from "util/db.js";

function VideosSection(props) {
  const router = useRouter();
  const [videos, setVideos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getVideosList().then((response) => {
      setLoading(false);
      const newVideos = response.videos.map((video) => {
        const metadata = video.filename.substr(0, video.filename.lastIndexOf("/") + 1) + "metadata.txt";
        const thumbnail = `http://${self.location.hostname}:5000` + video.thumbnail;
        return (
          <VideoCard video={video} key={video.filename}/>
        );
      });
      setVideos(newVideos);
    });
  }, []);

  return (
    <>
      {loading && (
        <PageLoader
          style={{
            height: "300px",
          }}
        />
      )}
      {!loading && (
        <Container>
          <SectionHeader
            title={props.title}
            subtitle={props.subtitle}
            size={1}
            spaced={true}
            className="text-center"
          />
          <CardDeck>
            {videos}
          </CardDeck>
        </Container>)}
    </>
  );

}

export default VideosSection;