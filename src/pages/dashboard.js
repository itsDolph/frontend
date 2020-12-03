import React, { useEffect, useState } from "react";
import PageLoader from "components/PageLoader";
import { useAuth } from "util/auth.js";
import { useRouter } from "next/router";
import VideoSection from "components/VideosSection";
import Modal from "react-bootstrap/Modal";
import FormAlert from "components/FormAlert";
import Form from "react-bootstrap/Form";
import FormField from "components/FormField";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { requireAuth } from "util/auth.js";
import { scrapeVideo} from "util/db.js";
import { useForm } from "react-hook-form";

function DashboardPage(props) {
  const [showModal, setShowModal] = useState(true);
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);

  const { register, handleSubmit, errors } = useForm();

  const hideModal = () => {
    setShowModal(false);
  };

  const onSubmit = (data) => {
    const { link } = data;
    setFormAlert(null)
    setPending(true);

    scrapeVideo({link: link}).then(() => {
      setPending(false);
   
      // Let parent know we're done so they can hide modal
      hideModal();
    })
    .catch((error) => {
      // Hide pending indicator
      setPending(false);
      // Show error alert message
      setFormAlert({
        type: "error",
        message: error.message,
      });
    });
    
  };

  return (
    <>
    <Modal show={showModal} onHide={hideModal}>
      <Modal.Header closeButton={true}>
        Please sign in again to complete this action
      </Modal.Header>
      <Modal.Body>
      {formAlert && (
          <FormAlert type={formAlert.type} message={formAlert.message} />
        )}
      <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="formConfirmPass">
              <FormField
                size="lg"
                name="link"
                type="text"
                placeholder="https://www.youtube.com/watch?v=0QofWPJIMXM"
                error={errors.pass}
                inputRef={register({
                  required: "Please enter a video link",
                })}
              />
            </Form.Group>
            <Button
              size="lg"
              variant="primary"
              block={true}
              type="submit"
              disabled={pending}
            >
              <span>Submit</span>

              {pending && (
                <Spinner
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden={true}
                  className="ml-2"
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              )}
            </Button>
          </Form>
          </Modal.Body>
    </Modal>
    <VideoSection 
    bg="white"
    textColor="dark"
    size="md"
    title="Videos"
    subtitle=""
    />
    </>
  );
}

export default requireAuth(DashboardPage);
