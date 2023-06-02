import React from "react";
import { useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";
export default function FeedbackForm() {
    const [contactInfo, setContactInfo] = useState("");

    const [feedback, setFeedback] = useState("");

    function submitFeedback(e) {
        e.preventDefault();
        axios.post("http://localhost:5000/submitFeedback", {
            contactInfo: contactInfo,
            feedback: feedback,
        }).then((response) => {

            alert("Feedback submitted successfully, thank you!");


        }).catch((error) => {
            alert("Feedback cannot be empty.")
        });


        setContactInfo("");
        setFeedback("");

    }

    return (
        <Container
            className="bg-light border rounded-3 p-3 mt-3 mb-0 align-items-center justify-content-center"
        >
            <h1>Your feedback is welcome!</h1>
            <Form
                onSubmit={submitFeedback}
            >
                <Form.Group controlId="contactInfo"
                    className="mb-1"
                >
                    <Form.Label>Contact Info</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter contact info"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="feedback">
                    <Form.Label>Feedback</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </Form.Group>
                <br></br>
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );




}
