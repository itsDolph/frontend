import React from "react";
import Section from "components/Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "components/SectionHeader";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import ListGroup from "react-bootstrap/ListGroup";
import Link from "next/link";
import { useAuth } from "util/auth.js";
import { useRouter } from "next/router";
import "components/DashboardSection.scss";
import { ClapprPlayer } from 'components/ClapprPlayer';

function PlayerSection(props) {
  const auth = useAuth();
  const router = useRouter();

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Row className="align-items-center mt-5">
        <ClapprPlayer metadata={props.metadata} />
        </Row>
      </Container>
    </Section>
  );
}

export default PlayerSection;
