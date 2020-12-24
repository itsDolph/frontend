import React, { useEffect, useState, useRef } from "react";
import Card from "react-bootstrap/Card";
import Carousel from "react-bootstrap/Carousel";
import Link from "next/link";

function VideoCard(props) {
    const video = props.video;
    const metadata = video.filename.substr(0, video.filename.lastIndexOf("/") + 1) + "metadata.txt";
    const thumbnail = `http://${self.location.hostname}:5000` + video.thumbnail;
    const previews = video.previews.sort().map((preview) => {
        return `http://${self.location.hostname}:5000` + preview;
    });

    const [previewImage, setPreviewImage] = useState(thumbnail);
    const [isHovering, setIsHovering] = useState(false);
    const [interval, setInterval] = useState(500);

    const carouselItems = previews.map((preview) => {
        return (<Carousel.Item key={preview}>
            <img
                className="d-block w-100"
                style={{ minHeight: '15rem' }}
                src={preview}
                interval={interval} 
            />
        </Carousel.Item>)
    });

    


    const ref = useRef(null);

    const handleMouseOver = () => {
        setIsHovering(true)
        // console.log("handleMouseOver");
    };
    const handleMouseOut = () => {
        setIsHovering(false);
        setPreviewImage(thumbnail);
        // console.log("handleMouseOut");
    };

    useEffect(
        () => {
            const node = ref.current;
            if (node) {
                node.addEventListener('mouseover', handleMouseOver);
                node.addEventListener('mouseout', handleMouseOut);

                return () => {
                    node.removeEventListener('mouseover', handleMouseOver);
                    node.removeEventListener('mouseout', handleMouseOut);
                };
            }
        },
        [] // Recall only if ref changes
    );


    return (
        <Card style={{ maxWidth: '18rem' }} className="mb-2">
            {/* {isHovering && ( */}
            <Carousel 
                                style={{ maxHeight: '15rem', opacity: isHovering ? '100' : '0'}} 
                                controls={false} 
                                interval={interval} 
                                slide={false} 
                                pause='none'
                                >
                                    {carouselItems} 
                            </Carousel>
                            {/* )} */}
            {/* {!isHovering && ( */}
            <Card.Img variant="top" src={previewImage} ref={ref} style={{ position: 'absolute', height: '15rem', opacity: !isHovering ? '100' : '0' }} />
             {/* )} */}
            <Card.Body>
                <Link
                    href={{
                        pathname: "/player",
                        query: { metadata: metadata },
                    }}
                ><a>{video.title}</a></Link>
            </Card.Body>
        </Card>
    );
}


export default VideoCard;