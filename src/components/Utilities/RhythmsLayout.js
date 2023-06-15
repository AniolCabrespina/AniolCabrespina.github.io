import {Col, Row} from "react-bootstrap";
import React from "react";
import Button from "react-bootstrap/Button";

export function buildRhythmsLayout() {
    let labelLayout = [];

    for (let slot = 1; slot <= 4; slot++) {
        labelLayout.push(<>
            <Col className={"d-flex justify-content-center nopadding rhythmCol"}>{slot}</Col>
            <Col className={"d-flex justify-content-center nopadding rhythmCol"}>___</Col>
            <Col className={"d-flex justify-content-center nopadding rhythmCol"}>&</Col>
            <Col className={"d-flex justify-content-center nopadding rhythmCol"}/>
        </>);
    }

    return labelLayout;
}