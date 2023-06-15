import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useLocation} from "react-router-dom";

export function EditTranscriptSecondView(props) {
    const location = useLocation();

    const [nextViewIndex] = useState(2);
    const [singer] = useState(props.singer);
    const [title] = useState(props.title);
    const [lyrics] = useState(...props.lyrics);
    const [labels, setLabels] = useState([]);
    const [labelingStruct, setLabelingStruct] = useState([])

    function handleOnDrag(e, labelType) {
        e.dataTransfer.setData("labelType", labelType);
    }

    function handleOnDrop(e) {
        const labelType = e.dataTransfer.getData("labelType").toString();

        setLabels(prevLabels => [...prevLabels, {
            labelType: labelType,
            aboveLine: e.target.dataset.aboveline
        }]);

        let element = document.createElement("Button");
        element.className = "btn btn-dark";
        element.onclick = handleOnClickLabel;
        element.dataset.aboveline = e.target.dataset.aboveline;
        element.innerHTML = labelType;

        e.target.parentNode.appendChild(element);
        e.target.parentNode.removeChild(e.target);
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleOnClick(e) {
        e.preventDefault();
        props.onClick(nextViewIndex, labels);
    }

    function handleOnClickLabel(e) {
        e.preventDefault();

        setLabels(prevLabels => prevLabels.filter(label => label.aboveLine != e.target.dataset.aboveline));

        let element = document.createElement("Button");
        element.className = "btn btn-secondary";
        element.onclick = handleOnClickLabel;
        element.id = e.target.id;
        element.dataset.aboveline = e.target.dataset.aboveline;
        element.innerHTML = "Arrosega una etiqueta aquí";

        e.target.parentNode.appendChild(element);
        e.target.parentNode.removeChild(e.target);
    }

    function handleOnClickAddLabelSlot() {
        setLabelingStruct(prevState => [(<Row className={"d-flex justify-content-center mt-xl-1"} onDrop={handleOnDrop}
                                              onDragOver={handleDragOver}>
            <Button className={"btn btn-secondary"} onClick={handleOnClickLabel}>Arrosega
                una etiqueta aquí</Button>
        </Row>), ...prevState]);
    }

    useEffect(() => {

        fetch(`/api/transcripts/${location.state.transcriptId}`)
            .then(res => res.json())
            .then(savedTranscript => {
                setLabels([...savedTranscript.labels]);

                let prevLine = "";
                if (lyrics.length === 1 && lyrics[0] === "") {
                    setLabelingStruct([(<Row className={"d-flex justify-content-center mt-xl-1"}>
                        <Button className={"btn btn-secondary"} onClick={handleOnClickAddLabelSlot}>Click to add label
                            slot</Button>
                    </Row>)]);
                } else {
                    let lyricsMapped = lyrics.map(function (line, index) {
                        let savedLabel = null;
                        if (line != "" && prevLine == "") {
                            prevLine = line;
                            savedTranscript.labels.forEach(label => {
                                if (label.aboveLine == index) {
                                    savedLabel = label;
                                    return;
                                }
                            });
                            if (savedLabel != null) {
                                return (<div key={index}>
                                    <Row className={"d-flex justify-content-center"} onDrop={handleOnDrop}
                                         onDragOver={handleDragOver}>
                                        <Button className={"btn btn-dark"} onClick={handleOnClickLabel}
                                                data-aboveline={index}>{savedLabel.labelType}</Button>
                                    </Row>
                                    <Row className={"d-flex justify-content-center"}>
                                        <p>{line}</p>
                                    </Row>
                                </div>);
                            } else {
                                return (<div key={index}>
                                    <Row className={"d-flex justify-content-center"} onDrop={handleOnDrop}
                                         onDragOver={handleDragOver}>
                                        <Button className={"btn btn-secondary"} onClick={handleOnClickLabel}
                                                data-aboveline={index}>Arrosega
                                            una etiqueta aquí</Button>
                                    </Row>
                                    <Row className={"d-flex justify-content-center"}>
                                        <p>{line}</p>
                                    </Row>
                                </div>);
                            }
                        } else if (line == "") {
                            prevLine = line;
                            return (<div key={index}>
                                <Row className={"d-flex justify-content-center mt-xl-4"}>
                                    <p>{line}</p>
                                </Row>
                            </div>)
                        } else {
                            prevLine = line;
                            return (<div key={index}>
                                <Row className={"d-flex justify-content-center"}>
                                    <p>{line}</p>
                                </Row>
                            </div>)
                        }
                    });
                    setLabelingStruct([...lyricsMapped]);
                }
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
                <h5>Lletra per etiquetar:</h5>
                <hr/>
                {labelingStruct}
            </Col>
            <Col className={"stickyColumn"}>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <h5>Etiquetes:</h5>
                    <hr/>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Verse 1")}>
                        Verse 1
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Verse 2")}>
                        Verse 2
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Verse 3")}>
                        Verse 3
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Verse 4")}>
                        Verse 4
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Verse 5")}>
                        Verse 5
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Verse 6")}>
                        Verse 6
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true}
                            onDragStart={(e) => handleOnDrag(e, "Pre-Chorus")}>
                        Pre-Chorus
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Chorus")}>
                        Chorus
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true}
                            onDragStart={(e) => handleOnDrag(e, "Post-Chorus")}>
                        Post-Chorus
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Intro")}>
                        Intro
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Outro")}>
                        Outro
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btn btn-dark"} draggable={true} onDragStart={(e) => handleOnDrag(e, "Bridge")}>
                        Bridge
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