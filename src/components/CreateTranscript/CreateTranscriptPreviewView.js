import {Col, Row} from "react-bootstrap";
import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import {buildRhythmsLayout} from "../Utilities/RhythmsLayout";
import down from "../../images/Rhythms/down.png";
import downAccent from "../../images/Rhythms/downAccent.png";
import downMute from "../../images/Rhythms/downMute.png";
import up from "../../images/Rhythms/up.png";
import upAccent from "../../images/Rhythms/upAccent.png";
import upMute from "../../images/Rhythms/upMute.png";
import {buildChordsLine} from "../Utilities/BuildChordsLine";
import {toast} from "react-toastify";

export function CreateTranscriptPreviewView(props) {
    const [mainHand] = useState(props.mainHand);
    const [nomenclature] = useState(props.nomenclature);
    const [username] = useState(props.username);

    const [singer] = useState(props.singer);
    const [title] = useState(props.title);
    const [lyrics] = useState(...props.lyrics);
    const [labels] = useState(...props.labels);
    const [chords] = useState(...props.chords);
    const [rhythms] = useState(...props.rhythms);
    const [tabs] = useState(...props.tabs)
    const [youtubeLink] = useState(props.youtubeLink);
    const [capo] = useState(props.capo);
    const [difficulty] = useState(props.difficulty);
    const [keyWritten] = useState(props.keyWritten);

    let rhythmStruct = [], transcriptStruct = [];

    function buildTabLineSavedData(tabLine, string, inputsFirstString, inputsSecondString, inputsThirdString, inputsFourthString, inputsFifthString, inputsSixthString) {
        let currentStringInputs = [];
        tabLine.push(<Row className={"nopadding"}></Row>)

        if (nomenclature == "AngloSaxon") {
            switch (string) {
                case 1:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>e</p>
                    </Col>);
                    currentStringInputs.push(...inputsFirstString);
                    break;
                case 2:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>B</p>
                    </Col>);
                    currentStringInputs.push(...inputsSecondString);
                    break;
                case 3:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>G</p>
                    </Col>);
                    currentStringInputs.push(...inputsThirdString);
                    break;
                case 4:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>D</p>
                    </Col>);
                    currentStringInputs.push(...inputsFourthString);
                    break;
                case 5:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>A</p>
                    </Col>);
                    currentStringInputs.push(...inputsFifthString);
                    break;
                case 6:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>E</p>
                    </Col>);
                    currentStringInputs.push(...inputsSixthString);
                    break;
                default:
                    break;
            }
        } else {
            switch (string) {
                case 1:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>mi</p>
                    </Col>);
                    currentStringInputs.push(...inputsFirstString);
                    break;
                case 2:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>SI</p>
                    </Col>);
                    currentStringInputs.push(...inputsSecondString);
                    break;
                case 3:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>SOL</p>
                    </Col>);
                    currentStringInputs.push(...inputsThirdString);
                    break;
                case 4:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>RE</p>
                    </Col>);
                    currentStringInputs.push(...inputsFourthString);
                    break;
                case 5:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>LA</p>
                    </Col>);
                    currentStringInputs.push(...inputsFifthString);
                    break;
                case 6:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>MI</p>
                    </Col>);
                    currentStringInputs.push(...inputsSixthString);
                    break;
                default:
                    break;
            }
        }

        if (currentStringInputs.length != 0) {
            currentStringInputs.sort(function (inputA, inputB) {
                return inputA.slot - inputB.slot
            });

            let stringInputsIdx = 0;

            for (let slot = 1; slot < 22; slot++) {

                if (currentStringInputs[stringInputsIdx].slot == slot) {
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"}
                           type={"text"}>{currentStringInputs[stringInputsIdx].textInput}</p>
                    </Col>);
                    if (stringInputsIdx < currentStringInputs.length - 1) {
                        stringInputsIdx++;
                    }
                } else {
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>----</p>
                    </Col>);
                }

            }
        } else {
            for (let slot = 1; slot < 22; slot++) {
                tabLine.push(<Col className={"col nopadding"}>
                    <p className={"tabLabel grid nopadding"} type={"text"}>----</p>
                </Col>);
            }
        }

        return tabLine;
    }

    function buildTabLine(currentLine) {
        let tabLine = [], strings = 6, currentTab, inputsFirstString = [], inputsSecondString = [],
            inputsThirdString = [], inputsFourthString = [],
            inputsFifthString = [], inputsSixthString = [];

        tabs.forEach(tab => {
            if (tab.belowLine == currentLine) {
                currentTab = tab;
            }
        });

        if (currentTab) {

            currentTab.tabInputs.forEach(input => {
                switch (Number(input.string)) {
                    case 1:
                        inputsFirstString.push(input);
                        break;
                    case 2:
                        inputsSecondString.push(input);
                        break;
                    case 3:
                        inputsThirdString.push(input);
                        break;
                    case 4:
                        inputsFourthString.push(input);
                        break;
                    case 5:
                        inputsFifthString.push(input);
                        break;
                    case 6:
                        inputsSixthString.push(input);
                        break;
                    default:
                        break;
                }
            });

            if (mainHand == "RightHanded") {
                for (let string = 1; string <= strings; string++) {
                    tabLine = buildTabLineSavedData(tabLine, string, inputsFirstString, inputsSecondString, inputsThirdString, inputsFourthString, inputsFifthString, inputsSixthString);
                }
            } else {
                for (let string = 6; string >= 1; string--) {
                    tabLine = buildTabLineSavedData(tabLine, string, inputsFirstString, inputsSecondString, inputsThirdString, inputsFourthString, inputsFifthString, inputsSixthString);
                }
            }
        }
        return tabLine;
    }

    function buildTranscriptStructure() {
        let currentLine = 0, currentLabel = 0, currentLabelAboveLine = -1;
        let label, line, renderFragment;

        while (lyrics.length > currentLine) {
            if (labels.length != 0) {
                label = labels[currentLabel];
                currentLabelAboveLine = label.aboveLine;
            }
            line = lyrics[currentLine];

            if (line == "") {

                renderFragment = (<div key={currentLine}>
                    <Row className={"d-flex justify-content-center mt-xl-4"}>
                        <p>{line}</p>
                    </Row>
                </div>);

                transcriptStruct.push(renderFragment);

            } else if (currentLine == currentLabelAboveLine) {
                let lineChords = [];

                chords.forEach(chord => {
                    if (chord.aboveLine == currentLine) {
                        lineChords.push(chord);
                    }
                });

                lineChords.sort(function (chordA, chordB) {
                    return chordA.lineSlot - chordB.lineSlot
                });

                renderFragment = (<div key={currentLine}>
                    <Row>
                        <h5>{label.labelType}:</h5>
                    </Row>
                    <Row className={"row nopadding"}>
                        {buildChordsLine(currentLine, lineChords, nomenclature)}
                    </Row>
                    <Row className={"clearFloat"}>
                        <p className={"lyricsDisplay"}>{line}</p>
                    </Row>
                    <Row className={"tabRow nopadding"}>
                        {buildTabLine(currentLine)}
                    </Row>
                </div>);

                transcriptStruct.push(renderFragment);

                if (labels.length - 1 > currentLabel) {
                    currentLabel++;
                }

            } else {
                let lineChords = [];

                chords.forEach(chord => {
                    if (chord.aboveLine == currentLine) {
                        lineChords.push(chord);
                    }
                });

                lineChords.sort(function (chordA, chordB) {
                    return chordA.lineSlot - chordB.lineSlot
                });

                renderFragment = (<div key={currentLine}>
                    <Row className={"row nopadding"}>
                        {buildChordsLine(currentLine, lineChords, nomenclature)}
                    </Row>
                    <Row className={"clearFloat"}>
                        <p className={"lyricsDisplay"}>{line}</p>
                    </Row>
                    <Row className={"tabRow nopadding"}>
                        {buildTabLine(currentLine)}
                    </Row>
                </div>);

                transcriptStruct.push(renderFragment);
            }
            currentLine++;
        }
    }

    function buildLabelRhythms(labelRhythms) {
        let labelGrid = [], rhythmIndex = 0;

        labelRhythms.sort(function (rhythmA, rhythmB) {
            return rhythmA.tempoSlot - rhythmB.tempoSlot;
        });

        for (let slot = 0; slot < 8; slot++) {
            let srcImage;

            if (Number(labelRhythms[rhythmIndex].tempoSlot) == slot) {

                switch (labelRhythms[rhythmIndex].rhythmType) {
                    case "Up":
                        srcImage = up;
                        break;
                    case "UpAccent":
                        srcImage = upAccent;
                        break;
                    case "UpMute":
                        srcImage = upMute;
                        break;
                    case "Down":
                        srcImage = down;
                        break;
                    case "DownAccent":
                        srcImage = downAccent;
                        break;
                    case "DownMute":
                        srcImage = downMute;
                        break;
                    default:
                        break;
                }

                labelGrid.push(<>
                    <Col className={"nopadding rhythmCol"}>
                        <Button className={"btn btn-dark rhythmButton nopadding"}><img className={"rhythmImage"}
                                                                                       alt={"Image"}
                                                                                       src={srcImage}/></Button>
                    </Col>
                    <Col className={"clearFloat rhythmCol"}/>
                </>);

                if (labelRhythms.length - 1 > rhythmIndex) {
                    rhythmIndex++;
                }

            } else {
                labelGrid.push(<>
                    <Col className={"nopadding rhythmCol"}>
                        <Button className={"btn gridRhythm nopadding"} disabled={true}>X</Button>
                    </Col>
                    <Col className={"clearFloat rhythmCol"}/>
                </>);
            }
        }
        return labelGrid;
    }

    function buildRhythmsStructure() {
        let currentLabel = 0, label, renderFragment, printedLabels = [];

        while (labels.length > currentLabel) {
            let labelRhythms = [];
            label = labels[currentLabel];

            if (!printedLabels.includes(label.labelType)) {

                rhythms.forEach(rhythm => {
                    if (rhythm.owningLabel == label.labelType) {
                        labelRhythms.push(rhythm);
                    }
                });

                if (labelRhythms.length > 0) {
                    renderFragment = (<div key={currentLabel}>
                        <Row className={"mt-xl-5 clearFloat"}>
                            <h5>{label.labelType}:</h5>
                        </Row>
                        <Row className={"mt-xl-2 nopadding"}>
                            {buildLabelRhythms(labelRhythms)}
                        </Row>
                        <Row className={"clearFloat"}/>
                        <Row className={"mt-xl-2 nopadding"}>
                            {buildRhythmsLayout()}
                        </Row>
                    </div>);
                    rhythmStruct.push(renderFragment);
                }
            }
            currentLabel++;
            printedLabels.push(label.labelType);
        }
    }

    function handleOnSaveClick(e) {
        e.preventDefault();

        let transcript = {
            transcriptId: '',
            owningUsers: [username],
            singer: singer,
            title: title,
            lyrics: lyrics,
            labels: labels,
            chords: chords,
            rhythms: rhythms,
            tabs: tabs,
            youtubeLink: youtubeLink,
            capo: capo,
            difficulty: difficulty,
            keyWritten: keyWritten,
            isPublished: false,
            nomenclatureWritten: nomenclature
        }

        fetch('/api/transcripts', {
            method: 'POST',
            body: JSON.stringify(transcript),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                toast.success('Transcript saved!', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }).catch(err => console.error(err));

        e.preventDefault();
        props.onClick();
    }

    function handleOnDiscardClick() {
        props.onClick();
    }

    function handleOnPublishClick(e) {
        e.preventDefault();

        let transcript = {
            transcriptId: '',
            owningUsers: [username],
            singer: singer,
            title: title,
            lyrics: lyrics,
            labels: labels,
            chords: chords,
            rhythms: rhythms,
            tabs: tabs,
            youtubeLink: youtubeLink,
            capo: capo,
            difficulty: difficulty,
            keyWritten: keyWritten,
            isPublished: true,
            nomenclatureWritten: nomenclature
        }

        fetch('/api/transcripts', {
            method: 'POST',
            body: JSON.stringify(transcript),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.ok) {
                toast.success('Transcript published!', {
                    position: "bottom-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
            }
        }).catch(err => console.error(err));

        e.preventDefault();
        props.onClick();
    }

    buildRhythmsStructure();
    buildTranscriptStructure();

    return <>
        <Row className={"mt-xl-5"}>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h2>{title} by {singer}</h2>
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row className={"mt-xl-5"}>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h5>
                        Difficulty: <span className={"extraInfoDisplay"}>{difficulty}</span>
                    </h5>
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h5>
                        Capo: <span className={"extraInfoDisplay"}>{capo}</span>
                    </h5>
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h5>
                        Key: <span className={"extraInfoDisplay"}>{keyWritten}</span>
                    </h5>
                </Col>
            </Col>
            <Col/>
        </Row>


        <Row>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center mt-xl-5"}>
                <Col>
                    <h4>Rhythms:</h4>
                    <hr/>
                    {rhythmStruct}
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center mt-xl-5"}>
                <Col>
                    <h4>Transcript:</h4>
                    <hr/>
                    {transcriptStruct}
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row className={"d-flex justify-content-center my-xl-5"}>
            <Col/>
            <Col className={"d-flex justify-content-center"}><Button className={"btn btn-dark"}
                                                                     onClick={handleOnSaveClick}>Guardar</Button></Col>
            <Col/>
            <Col className={"d-flex justify-content-center"}><Button className={"btn btn-dark"}
                                                                     onClick={handleOnDiscardClick}>Descartar</Button></Col>
            <Col/>
            <Col className={"d-flex justify-content-center"}><Button className={"btn btn-dark"}
                                                                     onClick={handleOnPublishClick}>Publicar</Button></Col>
            <Col/>
        </Row>
    </>
}