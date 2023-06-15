import {Row} from "react-bootstrap";
import React from "react";
import Button from "react-bootstrap/Button";

export function ChordChunk(chordName) {

    function handleOnDrag(e, chord) {
        e.dataTransfer.setData("chord", chord);
    }

    return <>
        <Row className={"d-flex justify-content-center mt-xl-1"}>
            <Button className={"btn btn-dark"} draggable={true}
                    onDragStart={(e) => handleOnDrag(e, chordName.chordName)}>
                {chordName.chordName}
            </Button>
        </Row>
        <Row className={"d-flex justify-content-center mt-xl-1"}>
            <Button className={"btn btn-dark"} draggable={true}
                    onDragStart={(e) => handleOnDrag(e, chordName.chordName + "7")}>
                {chordName.chordName}<span className={"chordComplement"}>7</span>
            </Button>
        </Row>
        <Row className={"d-flex justify-content-center mt-xl-1"}>
            <Button className={"btn btn-dark"} draggable={true}
                    onDragStart={(e) => handleOnDrag(e, chordName.chordName + "m")}>
                {chordName.chordName}<span className={"chordComplement"}>m</span>
            </Button>
        </Row>
        <Row className={"d-flex justify-content-center mt-xl-1"}>
            <Button className={"btn btn-dark"} draggable={true}
                    onDragStart={(e) => handleOnDrag(e, chordName.chordName + "m7")}>
                {chordName.chordName}<span className={"chordComplement"}>m7</span>
            </Button>
        </Row>
    </>

}