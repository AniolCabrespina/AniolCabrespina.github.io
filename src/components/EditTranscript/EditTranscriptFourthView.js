import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import down from "../../images/Rhythms/down.png";
import downAccent from "../../images/Rhythms/downAccent.png";
import downMute from "../../images/Rhythms/downMute.png";
import up from "../../images/Rhythms/up.png";
import upAccent from "../../images/Rhythms/upAccent.png";
import upMute from "../../images/Rhythms/upMute.png";
import downSound from "../../sounds/guitarStrum_Down.mp3";
import downAccentSound from "../../sounds/guitarStrum_DownAccent.mp3";
import downMuteSound from "../../sounds/guitarStrum_DownMute.mp3";
import upSound from "../../sounds/guitarStrum_Up.mp3";
import upAccentSound from "../../sounds/guitarStrum_UpAccent.mp3";
import upMuteSound from "../../sounds/guitarStrum_UpMute.mp3";

import {buildRhythmsLayout} from "../Utilities/RhythmsLayout";
import {useLocation} from "react-router-dom";

export function EditTranscriptFourthView(props) {
    const location = useLocation();

    const [nextViewIndex] = useState(4);
    const [singer] = useState(props.singer);
    const [title] = useState(props.title);
    const [labels] = useState(...props.labels);
    const [rhythms, setRhythms] = useState([]);

    const [rhythmStruct, setRhythmStruct] = useState([]);

    function handleOnDrag(e, rhythmType) {
        e.dataTransfer.setData("rhythmType", rhythmType);
    }

    function handleOnDrop(e) {
        const rhythmType = e.dataTransfer.getData("rhythmType").toString();

        setRhythms(prevRhythms => [...prevRhythms, {
            rhythmType: rhythmType, owningLabel: e.target.dataset.owninglabel, tempoSlot: e.target.dataset.temposlot
        }]);

        let element = document.createElement("Button");
        element.className = "btn btn-dark rhythmButton nopadding";
        element.onclick = handleOnClickRhythm;
        element.dataset.owninglabel = e.target.dataset.owninglabel;
        element.dataset.temposlot = e.target.dataset.temposlot;

        let tmp = document.createElement("img");
        tmp.className = "rhythmImage";
        tmp.alt = "Image"

        switch (rhythmType) {
            case "Up":
                tmp.src = up;
                break;
            case "UpAccent":
                tmp.src = upAccent;
                break;
            case "UpMute":
                tmp.src = upMute;
                break;
            case "Down":
                tmp.src = down;
                break;
            case "DownAccent":
                tmp.src = downAccent;
                break;
            case "DownMute":
                tmp.src = downMute;
                break;
            default:
                break;
        }

        element.appendChild(tmp);

        e.target.parentNode.appendChild(element);
        e.target.parentNode.removeChild(e.target);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleOnClick(e) {
        e.preventDefault();
        props.onClick(nextViewIndex, rhythms);
    }

    function handleOnClickRhythm(e) {
        e.preventDefault();

        if (e.target.className == "rhythmImage") {
            setRhythms(prevRhythms => prevRhythms.filter(rhythm => rhythm.owningLabel != e.target.parentNode.dataset.owninglabel));

            let element = document.createElement("Button");
            element.className = "btn gridRhythm nopadding";
            element.onclick = handleOnClickRhythm;
            element.dataset.owninglabel = e.target.parentNode.dataset.owninglabel;
            element.dataset.temposlot = e.target.parentNode.dataset.temposlot;
            element.innerHTML = "X";

            e.target.parentNode.parentNode.appendChild(element);
            e.target.parentNode.parentNode.removeChild(e.target.parentNode);
        } else {
            setRhythms(prevRhythms => prevRhythms.filter(rhythm => rhythm.owningLabel != e.target.dataset.owninglabel));

            let element = document.createElement("Button");
            element.className = "btn gridRhythm nopadding";
            element.onclick = handleOnClickRhythm;
            element.dataset.owninglabel = e.target.dataset.owninglabel;
            element.dataset.temposlot = e.target.dataset.temposlot;
            element.innerHTML = "X";

            e.target.parentNode.appendChild(element);
            e.target.parentNode.removeChild(e.target);
        }
    }

    function buildEditLabelGrid(labelType, savedRhythms) {
        let labelGrid = [];

        for (let tempoSlot = 0; tempoSlot <= 7; tempoSlot++) {
            let savedRhythm = "X", buttonClassName = "btn gridRhythm nopadding";

            savedRhythms.forEach(rhythm => {
                if (rhythm.tempoSlot == tempoSlot) {
                    savedRhythm = rhythm.rhythmType;
                    buttonClassName = "btn btn-dark rhythmButton nopadding";
                }
            });

            if (savedRhythm != "X") {
                switch (savedRhythm) {
                    case "Up":
                        savedRhythm = <img src={up} alt={"Image"} className={"rhythmImage"}/>;
                        break;
                    case "UpAccent":
                        savedRhythm = <img src={upAccent} alt={"Image"} className={"rhythmImage"}/>;
                        break;
                    case "UpMute":
                        savedRhythm = <img src={upMute} alt={"Image"} className={"rhythmImage"}/>;
                        break;
                    case "Down":
                        savedRhythm = <img src={down} alt={"Image"} className={"rhythmImage"}/>;
                        break;
                    case "DownAccent":
                        savedRhythm = <img src={downAccent} alt={"Image"} className={"rhythmImage"}/>;
                        break;
                    case "DownMute":
                        savedRhythm = <img src={downMute} alt={"Image"} className={"rhythmImage"}/>;
                        break;
                    default:
                        break;
                }
            }

            labelGrid.push(<>
                <Col className={"nopadding rhythmCol"} onDrop={handleOnDrop} onDragOver={handleDragOver}>
                    <Button className={buttonClassName} onClick={handleOnClickRhythm}
                            data-owninglabel={labelType} data-temposlot={tempoSlot}>{savedRhythm}</Button>
                </Col>
                <Col className={"clearFloat rhythmCol"}/>
            </>);
        }
        return labelGrid;
    }

    useEffect(() => {
        fetch(`/api/transcripts/${location.state.transcriptId}`)
            .then(res => res.json())
            .then(savedTranscript => {
                setRhythms([...savedTranscript.rhythms]);
                setRhythmStruct(prevRhythmStruct => {
                    let currentLabel = 0;
                    let label, builtRhythmStruct = [], printedLabels = [];

                    while (labels.length > currentLabel) {

                        let savedRhythms = [];
                        label = labels[currentLabel];

                        if (!printedLabels.includes(label.labelType)) {
                            savedTranscript.rhythms.forEach(rhythm => {
                                if (rhythm.owningLabel == label.labelType) {
                                    savedRhythms.push(rhythm);
                                }
                            });

                            builtRhythmStruct.push(<div key={currentLabel}>
                                <Row className={"mt-xl-5 clearFloat"}>
                                    <h5>{label.labelType}:</h5>
                                </Row>
                                <Row className={"mt-xl-2 nopadding"}>
                                    {buildEditLabelGrid(label.labelType, savedRhythms)}
                                </Row>
                                <Row className={"clearFloat"}/>
                                <Row className={"mt-xl-2 nopadding"}>
                                    {buildRhythmsLayout()}
                                </Row>
                            </div>);
                        }
                        currentLabel++;
                        printedLabels.push(label.labelType);
                    }
                    return [...prevRhythmStruct, builtRhythmStruct];
                });
            }).catch(err => console.error(err));
    }, []);

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
                <h5>Ritme del Rascat:</h5>
                <hr/>
                {rhythmStruct}
            </Col>
            <Col className={"stickyColumn"}>
                <Row className={"mt-xl-1 stickyHeader"}>
                    <h5>Rascats:</h5>
                    <hr/>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark rhythmButton nopadding"} draggable={true}
                            onDragStart={(e) => handleOnDrag(e, "Up")} onClick={() => {
                        let audio = new Audio(upSound);
                        audio.play();
                    }}>
                        <img src={up} alt={"Image"} className={"rhythmImage"}/>
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark rhythmButton nopadding"} draggable={true}
                            onDragStart={(e) => handleOnDrag(e, "Down")} onClick={() => {
                        let audio = new Audio(downSound);
                        audio.play();
                    }}>
                        <img src={down} alt={"Image"} className={"rhythmImage"}/>
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark rhythmButton nopadding"} draggable={true}
                            onDragStart={(e) => handleOnDrag(e, "UpAccent")} onClick={() => {
                        let audio = new Audio(upAccentSound);
                        audio.play();
                    }}>
                        <img src={upAccent} alt={"Image"} className={"rhythmImage"}/>
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark rhythmButton nopadding"} draggable={true}
                            onDragStart={(e) => handleOnDrag(e, "DownAccent")} onClick={() => {
                        let audio = new Audio(downAccentSound);
                        audio.play();
                    }}>
                        <img src={downAccent} alt={"Image"} className={"rhythmImage"}/>
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark rhythmButton nopadding"} draggable={true}
                            onDragStart={(e) => handleOnDrag(e, "UpMute")} onClick={() => {
                        let audio = new Audio(upMuteSound);
                        audio.play();
                    }}>
                        <img src={upMute} alt={"Image"} className={"rhythmImage"}/>
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark rhythmButton nopadding"} draggable={true}
                            onDragStart={(e) => handleOnDrag(e, "DownMute")} onClick={() => {
                        let audio = new Audio(downMuteSound);
                        audio.play();
                    }}>
                        <img src={downMute} alt={"Image"} className={"rhythmImage"}/>
                    </Button>
                </Row>
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