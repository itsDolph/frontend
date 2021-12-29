import React, { useEffect, useState } from "react";
import PageLoader from "components/PageLoader";
import Container from "react-bootstrap/Container";
import SectionHeader from "components/SectionHeader";
import ListGroup from "react-bootstrap/ListGroup";
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
        return (
          <ListGroup.Item key={video.filename}>
            <Link
              href={{
                pathname: "/player",
                query: { metadata: metadata },
              }}
            ><a>{video.title}</a></Link>
          </ListGroup.Item>
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
          <ListGroup className="mt-2">
            {videos}
          </ListGroup>
        </Container>)}
    </>
  );

}

export default VideosSection;