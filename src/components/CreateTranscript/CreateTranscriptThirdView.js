import {Col, FormControl, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {ChordChunk} from "../Utilities/ChordChunk";

export function CreateTranscriptThirdView(props) {
    const [mainHand] = useState(props.mainHand);
    const [nomenclature] = useState(props.nomenclature);

    const [nextViewIndex] = useState(3);
    const [singer] = useState(props.singer);
    const [title] = useState(props.title);
    const [lyrics] = useState(...props.lyrics);
    const [labels] = useState(...props.labels);
    const [chords, setChords] = useState([]);

    const [chordsStruct, setChordsStruct] = useState([]);
    const [customChord, setCustomChord] = useState("");

    let chordChunks = [];

    function handleOnDrop(e) {
        const chord = e.dataTransfer.getData("chord").toString();

        setChords(prevChords => [...prevChords, {
            chord: chord, aboveLine: e.target.dataset.aboveline, lineSlot: e.target.dataset.lineslot
        }]);

        let element = document.createElement("Button");
        element.className = "btn btn-dark chordAssigned nopadding";
        element.onclick = handleOnClickChord;
        element.dataset.aboveline = e.target.dataset.aboveline;
        element.dataset.lineslot = e.target.dataset.lineslot;

        if (nomenclature == "AngloSaxon") {
            if (chord.length == 1) {
                element.innerHTML = chord;
            } else {
                element.innerHTML = chord[0];
                let tmp = document.createElement("span");
                tmp.className = "chordComplement";
                tmp.innerHTML = chord.substring(1);
                element.appendChild(tmp);
            }
        } else {
            if (chord.length == 2 || (chord.includes("SOL") && chord.length == 3)) {
                element.innerHTML = chord;
            } else if (chord.includes("SOL")) {
                element.innerHTML = chord[0] + chord[1] + chord[2];
                let tmp = document.createElement("span");
                tmp.className = "chordComplement";
                tmp.innerHTML = chord.substring(3);
                element.appendChild(tmp);
            } else {
                element.innerHTML = chord[0] + chord[1];
                let tmp = document.createElement("span");
                tmp.className = "chordComplement";
                tmp.innerHTML = chord.substring(2);
                element.appendChild(tmp);
            }
        }
        e.target.parentNode.appendChild(element);
        e.target.parentNode.removeChild(e.target);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleOnClick(e) {
        e.preventDefault();
        props.onClick(nextViewIndex, chords);
    }

    function handleOnClickChord(e) {
        e.preventDefault();
        setChords(prevChords => prevChords.filter(chord => chord.aboveLine != e.target.dataset.aboveline || chord.lineSlot != e.target.dataset.lineslot));

        let element = document.createElement("Button");
        element.className = "btn grid";
        element.onclick = handleOnClickChord;
        element.dataset.aboveline = e.target.dataset.aboveline;
        element.dataset.lineslot = e.target.dataset.lineslot;
        element.innerHTML = "X";

        e.target.parentNode.appendChild(element);
        e.target.parentNode.removeChild(e.target);
    }

    function buildLineGrid(currentLine) {
        let lineGrid = [];

        if (currentLine < 0) {
            for (let slot = 0; slot < 22; slot++) {
                lineGrid.push(<Col className={"col nopadding"}>
                    <Button className={"btn grid nopadding"} onClick={handleOnClickChord}
                            data-lineslot={slot}>X</Button>
                </Col>);
            }
        } else {
            for (let slot = 0; slot < 22; slot++) {
                lineGrid.push(<Col className={"col nopadding"}>
                    <Button className={"btn grid nopadding"} onClick={handleOnClickChord} data-aboveline={currentLine}
                            data-lineslot={slot}>X</Button>
                </Col>);
            }
        }

        return lineGrid;
    }

    function handleOnClickAddGridLine(e) {
        const insertIndex = Number(e.target.dataset.index);

        let lineGrid = <Row className={"lineGrid d-flex justify-content-center mt-xl-1"} onDrop={handleOnDrop}
                            onDragOver={handleDragOver}>
            {buildLineGrid(-1)}
        </Row>;

        setChordsStruct(prevState => {
            let newState = prevState;

            newState.forEach((element, i) => {
                if (i >= insertIndex) {
                    if (element.props.children.hasOwnProperty('props')) {
                        if (element.props.children.props.hasOwnProperty('data-index')) {
                            let addGrid = <Row className={"d-flex justify-content-center mt-xl-3"}>
                                <Button className={"btn btn-secondary"} onClick={handleOnClickAddGridLine}
                                        data-index={element.props.children.props["data-index"] + 1}>Click to add a grid
                                    line</Button>
                            </Row>;
                            newState.splice(i, 1, addGrid)
                        }
                    }
                }
            });
            newState.splice(insertIndex, 0, lineGrid);
            return [...newState];
        });
    }

    useEffect(() => {
        let currentLine = 0, currentLabel = 0, currentAboveLine = -1;
        let label, line, renderFragment, builtChordStruct = [];

        while (lyrics.length > currentLine) {
            if (labels.length != 0) {
                label = labels[currentLabel];
                currentAboveLine = label.aboveLine;
            }

            line = lyrics[currentLine];

            if (line == "") {

                renderFragment = (<div key={currentLine}>
                    <Row className={"d-flex justify-content-center mt-xl-4"}>
                        <p>{line}</p>
                    </Row>
                </div>);
                builtChordStruct.push(renderFragment);

            } else if (currentLine == currentAboveLine) {

                renderFragment = (<div key={currentLine}>
                    <Row>
                        <h5>{label.labelType}:</h5>
                    </Row>
                    <Row className={"row nopadding"} onDrop={handleOnDrop} onDragOver={handleDragOver}>
                        {buildLineGrid(currentLine)}
                    </Row>
                    <Row className={"row clearFloat"}>
                        <p className={"lyricsDisplay"}>{line}</p>
                    </Row>
                </div>);
                builtChordStruct.push(renderFragment);

                if (labels.length - 1 > currentLabel) {
                    currentLabel++;
                }
            } else {
                renderFragment = (<div key={currentLine}>
                    <Row className={"row nopadding"} onDrop={handleOnDrop} onDragOver={handleDragOver}>
                        {buildLineGrid(currentLine)}
                    </Row>
                    <Row className={"row clearFloat"}>
                        <p>{line}</p>
                    </Row>
                </div>);
                builtChordStruct.push(renderFragment);
            }
            currentLine++;
        }
        setChordsStruct(prevState => [...prevState, builtChordStruct]);
    }, []);

    function handleCustomChordChange(e) {
        setCustomChord(e.target.value);
    }

    function handleOnCreateChordClicked() {

        function handleOnDrag(e, chord) {
            e.dataTransfer.setData("chord", chord);
        }

        let customChordRow = document.getElementById("customChordRow");

        let row = document.createElement("div");
        row.className = "d-flex justify-content-center mt-xl-1 row";

        let tmp = document.createElement("Button");
        tmp.className = "btn btn-dark";
        tmp.draggable = true;
        tmp.ondragstart = (e) => handleOnDrag(e, customChord);
        tmp.innerHTML = customChord;

        console.log(tmp);

        row.appendChild(tmp);
        customChordRow.parentNode.appendChild(row);
    }

    function displayChordChunks() {
        if (nomenclature == "AngloSaxon") {
            chordChunks.push(<ChordChunk chordName={"C"}/>);
            chordChunks.push(<ChordChunk chordName={"D"}/>);
            chordChunks.push(<ChordChunk chordName={"E"}/>);
            chordChunks.push(<ChordChunk chordName={"F"}/>);
            chordChunks.push(<ChordChunk chordName={"G"}/>);
            chordChunks.push(<ChordChunk chordName={"A"}/>);
            chordChunks.push(<ChordChunk chordName={"B"}/>);
        } else {
            chordChunks.push(<ChordChunk chordName={"DO"}/>);
            chordChunks.push(<ChordChunk chordName={"RE"}/>);
            chordChunks.push(<ChordChunk chordName={"MI"}/>);
            chordChunks.push(<ChordChunk chordName={"FA"}/>);
            chordChunks.push(<ChordChunk chordName={"SOL"}/>);
            chordChunks.push(<ChordChunk chordName={"LA"}/>);
            chordChunks.push(<ChordChunk chordName={"SI"}/>);
        }
    }

    displayChordChunks();

    return <>
        <Row className={"mt-xl-5"}>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h5>Cantant: {singer}</h5>
                </Col>
                <Col/>
                <Col>
                    <h5>Títol: {title}</h5>
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row className={"d-flex justify-content-center mt-xl-5"}>
            <Col className={"mx-xl-3"}/>
            <Col xs={8} className={"mx-xl-3"}>
                <h5>Insertar Acords:</h5>
                <hr/>
                {chordsStruct}
            </Col>
            <Col className={"stickyColumn"}>
                <Row className={"mt-xl-1 stickyHeader"}>
                    <h5>Acords:</h5>
                    <hr/>
                </Row>
                {chordChunks}
                <hr className={"mt-xl-1"}/>
                <Row id={"customChordRow"} className={"d-flex justify-content-center mt-xl-1"}>
                    <FormControl placeholder={"Custom chord"} onChange={handleCustomChordChange}/>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark mt-xl-1"} onClick={handleOnCreateChordClicked}>Create
                        Chord</Button>
                </Row>
                <hr className={"mt-xl-1"}/>
            </Col>
        </Row>

        <Row className={"d-flex justify-content-center my-xl-5"}>
            <Col/>
            <Col xs={8}>
                <Button className={"btn btn-dark"} onClick={handleOnClick}>Següent</Button>
            </Col>
            <Col/>
        </Row>
    </>
}