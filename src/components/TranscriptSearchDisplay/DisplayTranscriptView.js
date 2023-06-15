import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {buildRhythmsLayout} from "../Utilities/RhythmsLayout";
import down from "../../images/Rhythms/down.png";
import downAccent from "../../images/Rhythms/downAccent.png";
import downMute from "../../images/Rhythms/downMute.png";
import up from "../../images/Rhythms/up.png";
import upAccent from "../../images/Rhythms/upAccent.png";
import upMute from "../../images/Rhythms/upMute.png";
import {buildChordsLine} from "../Utilities/BuildChordsLine";
import {useLocation} from "react-router-dom";
import html2pdf from "html2pdf.js/src";
import {FaStar} from "react-icons/fa";
import leftHandedCImage from "../../images/LeftHandedChords/leftHanded_C.png";
import leftHandedCmImage from "../../images/LeftHandedChords/leftHanded_Cm.png";
import leftHandedC7Image from "../../images/LeftHandedChords/leftHanded_C7.png";
import leftHandedDImage from "../../images/LeftHandedChords/leftHanded_D.png";
import leftHandedDmImage from "../../images/LeftHandedChords/leftHanded_Dm.png";
import leftHandedD7Image from "../../images/LeftHandedChords/leftHanded_D7.png";
import leftHandedEImage from "../../images/LeftHandedChords/leftHanded_E.png";
import leftHandedEmImage from "../../images/LeftHandedChords/leftHanded_Em.png";
import leftHandedE7Image from "../../images/LeftHandedChords/leftHanded_E7.png";
import leftHandedFImage from "../../images/LeftHandedChords/leftHanded_F.png";
import leftHandedFmImage from "../../images/LeftHandedChords/leftHanded_Fm.png";
import leftHandedF7Image from "../../images/LeftHandedChords/leftHanded_F7.png";
import leftHandedGImage from "../../images/LeftHandedChords/leftHanded_G.png";
import leftHandedGmImage from "../../images/LeftHandedChords/leftHanded_Gm.png";
import leftHandedG7Image from "../../images/LeftHandedChords/leftHanded_G7.png";
import leftHandedAImage from "../../images/LeftHandedChords/leftHanded_A.png";
import leftHandedAmImage from "../../images/LeftHandedChords/leftHanded_Am.png";
import leftHandedA7Image from "../../images/LeftHandedChords/leftHanded_A7.png";
import leftHandedBImage from "../../images/LeftHandedChords/leftHanded_B.png";
import leftHandedBmImage from "../../images/LeftHandedChords/leftHanded_Bm.png";
import leftHandedB7Image from "../../images/LeftHandedChords/leftHanded_B7.png";
import rightHandedCImage from "../../images/RightHandedChords/rightHanded_C.png";
import rightHandedCmImage from "../../images/RightHandedChords/rightHanded_Cm.png";
import rightHandedC7Image from "../../images/RightHandedChords/rightHanded_C7.png";
import rightHandedDImage from "../../images/RightHandedChords/rightHanded_D.png";
import rightHandedDmImage from "../../images/RightHandedChords/rightHanded_Dm.png";
import rightHandedD7Image from "../../images/RightHandedChords/rightHanded_D7.png";
import rightHandedEImage from "../../images/RightHandedChords/rightHanded_E.png";
import rightHandedEmImage from "../../images/RightHandedChords/rightHanded_Em.png";
import rightHandedE7Image from "../../images/RightHandedChords/rightHanded_E7.png";
import rightHandedFImage from "../../images/RightHandedChords/rightHanded_F.png";
import rightHandedFmImage from "../../images/RightHandedChords/rightHanded_Fm.png";
import rightHandedF7Image from "../../images/RightHandedChords/rightHanded_F7.png";
import rightHandedGImage from "../../images/RightHandedChords/rightHanded_G.png";
import rightHandedGmImage from "../../images/RightHandedChords/rightHanded_Gm.png";
import rightHandedG7Image from "../../images/RightHandedChords/rightHanded_G7.png";
import rightHandedAImage from "../../images/RightHandedChords/rightHanded_A.png";
import rightHandedAmImage from "../../images/RightHandedChords/rightHanded_Am.png";
import rightHandedA7Image from "../../images/RightHandedChords/rightHanded_A7.png";
import rightHandedBImage from "../../images/RightHandedChords/rightHanded_B.png";
import rightHandedBmImage from "../../images/RightHandedChords/rightHanded_Bm.png";
import rightHandedB7Image from "../../images/RightHandedChords/rightHanded_B7.png";
import {toast} from "react-toastify";

export function DisplayTranscriptView(props) {
    const location = useLocation();

    const [username] = useState(props.username);
    const [mainHand] = useState(props.mainHand);
    const [nomenclature] = useState(props.nomenclature);

    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(null);

    const [transcriptId, setTranscriptId] = useState();
    const [singer] = useState(location.state.singer);
    const [title] = useState(location.state.title);
    const [lyrics, setLyrics] = useState([]);
    const [labels, setLabels] = useState([]);
    const [chords, setChords] = useState([]);
    const [rhythms, setRhythms] = useState([]);
    const [tabs, setTabs] = useState([])
    const [youtubeLink, setYoutubeLink] = useState("");
    const [capo, setCapo] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [keyWritten, setKeyWritten] = useState("");
    const [nomenclatureWritten, setNomenclatureWritten] = useState("");

    const [owningUsers] = useState(location.state.owningUsers);

    const [isChordsSimplified, setIsChordsSimplified] = useState(false);
    const [unsimplifiedChords, setUnsimplifiedChords] = useState([]);

    const [isScrolling, setIsScrolling] = useState(false);
    const [autoScrollTimeout, setAutoScrollTimeout] = useState();
    const [autoScrollSpeed, setAutoScrollSpeed] = useState(5);

    const [currentFontTypeIndex, setCurrentFontTypeIndex] = useState(2);
    const [currentFontSizeIndex, setCurrentFontSizeIndex] = useState(1);

    let rhythmStruct = [], transcriptStruct = [], chordsImages = [],
        fontTypes = ["Anton", "Dancing Script", "Montserrat", "Pangolin", "Permanent Marker", "Roboto", "Smokum"],
        fontSizes = ["smallFont", "mediumFont", "bigFont"];

    useEffect(() => {
        fetch('/api/transcripts')
            .then(res => res.json())
            .then(savedTranscripts => {
                savedTranscripts.forEach(savedTranscript => {
                    if (savedTranscript.singer.toUpperCase() == singer.toUpperCase() && savedTranscript.title.toUpperCase() == title.toUpperCase() && savedTranscript.owningUsers == owningUsers) {
                        setTranscriptId(savedTranscript._id);
                        setLyrics([...savedTranscript.lyrics]);
                        setLabels([...savedTranscript.labels]);
                        setChords([...translateChords(savedTranscript.chords, savedTranscript.nomenclatureWritten)]);
                        setRhythms([...savedTranscript.rhythms]);
                        setTabs([...savedTranscript.tabs]);
                        setYoutubeLink(() => {
                            return savedTranscript.youtubeLink.replace("watch?v=", "embed/");
                        });
                        setCapo(savedTranscript.capo);
                        setDifficulty(savedTranscript.difficulty);
                        setKeyWritten(savedTranscript.keyWritten);
                        setNomenclatureWritten(savedTranscript.nomenclatureWritten);
                        setRating(() => {
                            let savedRating = 0;
                            savedTranscript.userRatings.forEach(userRating => {
                                if (userRating.username == username) {
                                    savedRating = Number(userRating.rating);
                                }
                            });
                            return savedRating;
                        });
                    }
                });
            }).catch(err => console.error(err));
    }, []);

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
            inputsThirdString = [], inputsFourthString = [], inputsFifthString = [], inputsSixthString = [];

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

            if (mainHand == "LeftHanded") {
                for (let string = 6; string >= 1; string--) {
                    tabLine = buildTabLineSavedData(tabLine, string, inputsFirstString, inputsSecondString, inputsThirdString, inputsFourthString, inputsFifthString, inputsSixthString);
                }
            } else {
                for (let string = 1; string <= strings; string++) {
                    tabLine = buildTabLineSavedData(tabLine, string, inputsFirstString, inputsSecondString, inputsThirdString, inputsFourthString, inputsFifthString, inputsSixthString);
                }
            }
        }
        return tabLine;
    }

    function translateChords(chords, translateNomenclatureWritten) {
        if (username != "") {
            if (nomenclature != translateNomenclatureWritten) {
                if (nomenclature == "AngloSaxon") {
                    chords.forEach(chord => {
                        if (chord.chord.includes("DO")) {
                            chord.chord = chord.chord.replace("DO", "C");
                        } else if (chord.chord.includes("RE")) {
                            chord.chord = chord.chord.replace("RE", "D");
                        } else if (chord.chord.includes("MI")) {
                            chord.chord = chord.chord.replace("MI", "E");
                        } else if (chord.chord.includes("FA")) {
                            chord.chord = chord.chord.replace("FA", "F");
                        } else if (chord.chord.includes("SOL")) {
                            chord.chord = chord.chord.replace("SOL", "G");
                        } else if (chord.chord.includes("LA")) {
                            chord.chord = chord.chord.replace("LA", "A");
                        } else if (chord.chord.includes("SI")) {
                            chord.chord = chord.chord.replace("SI", "B");
                        }
                    });
                } else {
                    chords.forEach(chord => {
                        if (chord.chord.includes("C")) {
                            chord.chord = chord.chord.replace("C", "DO");
                        } else if (chord.chord.includes("D")) {
                            chord.chord = chord.chord.replace("D", "RE");
                        } else if (chord.chord.includes("E")) {
                            chord.chord = chord.chord.replace("E", "MI");
                        } else if (chord.chord.includes("F")) {
                            chord.chord = chord.chord.replace("F", "FA");
                        } else if (chord.chord.includes("G")) {
                            chord.chord = chord.chord.replace("G", "SOL");
                        } else if (chord.chord.includes("A")) {
                            chord.chord = chord.chord.replace("A", "LA");
                        } else if (chord.chord.includes("B")) {
                            chord.chord = chord.chord.replace("B", "SI");
                        }
                    });
                }
            }
        }
        return chords;
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
                        <p className={"lyrics fontMontserrat mediumFont"}>{line}</p>
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

                if (username == "") {
                    renderFragment = (<div key={currentLine}>
                        <Row>
                            <h5>{label.labelType}:</h5>
                        </Row>
                        <Row className={"row nopadding"}>
                            {buildChordsLine(currentLine, lineChords, nomenclatureWritten)}
                        </Row>
                        <Row className={"clearFloat"}>
                            <p className={"lyrics fontMontserrat mediumFont"}>{line}</p>
                        </Row>
                        <Row className={"tabRow nopadding"}>
                            {buildTabLine(currentLine)}
                        </Row>
                    </div>);
                } else {
                    renderFragment = (<div key={currentLine}>
                        <Row>
                            <h5>{label.labelType}:</h5>
                        </Row>
                        <Row className={"row nopadding"}>
                            {buildChordsLine(currentLine, lineChords, nomenclature)}
                        </Row>
                        <Row className={"clearFloat"}>
                            <p className={"lyrics fontMontserrat mediumFont"}>{line}</p>
                        </Row>
                        <Row className={"tabRow nopadding"}>
                            {buildTabLine(currentLine)}
                        </Row>
                    </div>);
                }
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

                if (username == "") {
                    renderFragment = (<div key={currentLine}>
                        <Row className={"row nopadding"}>
                            {buildChordsLine(currentLine, lineChords, nomenclatureWritten)}
                        </Row>
                        <Row className={"clearFloat"}>
                            <p className={"lyrics fontMontserrat mediumFont"}>{line}</p>
                        </Row>
                        <Row className={"tabRow nopadding"}>
                            {buildTabLine(currentLine)}
                        </Row>
                    </div>);
                } else {
                    renderFragment = (<div key={currentLine}>
                        <Row className={"row nopadding"}>
                            {buildChordsLine(currentLine, lineChords, nomenclature)}
                        </Row>
                        <Row className={"clearFloat"}>
                            <p className={"lyrics fontMontserrat mediumFont"}>{line}</p>
                        </Row>
                        <Row className={"tabRow nopadding"}>
                            {buildTabLine(currentLine)}
                        </Row>
                    </div>);
                }
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

    function simplifyChords() {
        let simplifiedChords = [];

        if (isChordsSimplified) {
            setChords(unsimplifiedChords);
            setIsChordsSimplified(false);
        } else {
            if (username != "") {
                if (nomenclature == "AngloSaxon") {
                    chords.forEach(simplifiedChord => {
                        if (simplifiedChord.chord.length > 1) {
                            simplifiedChords.push({
                                id: simplifiedChord.id,
                                chord: simplifiedChord.chord.substring(0, 1),
                                aboveLine: simplifiedChord.aboveLine,
                                lineSlot: simplifiedChord.lineSlot,
                                _id: simplifiedChord._id
                            });
                        } else {
                            simplifiedChords.push(simplifiedChord);
                        }
                    });
                } else {
                    chords.forEach(simplifiedChord => {
                        if (simplifiedChord.chord.includes("SOL")) {
                            simplifiedChords.push({
                                id: simplifiedChord.id,
                                chord: simplifiedChord.chord.substring(0, 3),
                                aboveLine: simplifiedChord.aboveLine,
                                lineSlot: simplifiedChord.lineSlot,
                                _id: simplifiedChord._id
                            });
                        } else if (simplifiedChord.chord.length > 2) {
                            simplifiedChords.push({
                                id: simplifiedChord.id,
                                chord: simplifiedChord.chord.substring(0, 2),
                                aboveLine: simplifiedChord.aboveLine,
                                lineSlot: simplifiedChord.lineSlot,
                                _id: simplifiedChord._id
                            });
                        } else {
                            simplifiedChords.push(simplifiedChord);
                        }
                    });
                }
            } else {
                if (nomenclatureWritten == "AngloSaxon") {
                    chords.forEach(simplifiedChord => {
                        if (simplifiedChord.chord.length > 1) {
                            simplifiedChords.push({
                                id: simplifiedChord.id,
                                chord: simplifiedChord.chord.substring(0, 1),
                                aboveLine: simplifiedChord.aboveLine,
                                lineSlot: simplifiedChord.lineSlot,
                                _id: simplifiedChord._id
                            });
                        } else {
                            simplifiedChords.push(simplifiedChord);
                        }
                    });
                } else {
                    chords.forEach(simplifiedChord => {
                        if (simplifiedChord.chord.includes("SOL")) {
                            simplifiedChords.push({
                                id: simplifiedChord.id,
                                chord: simplifiedChord.chord.substring(0, 3),
                                aboveLine: simplifiedChord.aboveLine,
                                lineSlot: simplifiedChord.lineSlot,
                                _id: simplifiedChord._id
                            });
                        } else if (simplifiedChord.chord.length > 2) {
                            simplifiedChords.push({
                                id: simplifiedChord.id,
                                chord: simplifiedChord.chord.substring(0, 2),
                                aboveLine: simplifiedChord.aboveLine,
                                lineSlot: simplifiedChord.lineSlot,
                                _id: simplifiedChord._id
                            });
                        } else {
                            simplifiedChords.push(simplifiedChord);
                        }
                    });
                }
            }
            setUnsimplifiedChords(chords);
            setChords(simplifiedChords);
            setIsChordsSimplified(true);
        }
    }

    function angloSaxonTransposeSemiBelow(transposedChords) {
        chords.forEach(transposedChord => {
            if (transposedChord.chord.includes("b")) {
                if (transposedChord.chord.includes("D")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/D/, "C").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("E")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/E/, "D").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("G")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/G/, "F").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("A")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/A/, "G").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("B")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/B/, "A").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                }
            } else if (transposedChord.chord.includes("#")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.slice(0, -1),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else if (transposedChord.chord.includes("F")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.replace(/F/, "E"),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else if (transposedChord.chord.includes("C")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.replace(/C/, "B"),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord + "b",
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            }
        });
        return transposedChords;
    }

    function latinTransposeSemiBelow(transposedChords) {
        chords.forEach(transposedChord => {
            if (transposedChord.chord.includes("b")) {
                if (transposedChord.chord.includes("RE")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/RE/, "DO").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("MI")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/MI/, "RE").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("SOL")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/SOL/, "FA").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("LA")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/LA/, "SOL").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("SI")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/SI/, "LA").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                }
            } else if (transposedChord.chord.includes("#")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.slice(0, -1),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else if (transposedChord.chord.includes("FA")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.replace(/FA/, "MI"),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else if (transposedChord.chord.includes("DO")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.replace(/DO/, "SI"),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord + "b",
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            }
        });
        return transposedChords;
    }

    function transposeSemiBelow() {
        let transposedChords = [];

        if (username == "") {
            if (nomenclatureWritten == "AngloSaxon") {
                transposedChords = angloSaxonTransposeSemiBelow(transposedChords);
            } else {
                transposedChords = latinTransposeSemiBelow(transposedChords);
            }
        } else {
            if (nomenclature == "AngloSaxon") {
                transposedChords = angloSaxonTransposeSemiBelow(transposedChords);
            } else {
                transposedChords = latinTransposeSemiBelow(transposedChords);
            }
        }
        setChords(transposedChords);
    }

    function angloSaxonTransposeSemiAbove(transposedChords) {
        chords.forEach(transposedChord => {
            if (transposedChord.chord.includes("#")) {
                if (transposedChord.chord.includes("C")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/C/, "D").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("D")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/D/, "E").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("F")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/F/, "G").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("G")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/G/, "A").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("A")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/A/, "B").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                }
            } else if (transposedChord.chord.includes("b")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.slice(0, -1),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else if (transposedChord.chord.includes("E")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.replace(/E/, "F"),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else if (transposedChord.chord.includes("B")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.replace(/B/, "C"),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord + "#",
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            }
        });
        return transposedChords;
    }

    function latinTransposeSemiAbove(transposedChords) {
        chords.forEach(transposedChord => {
            if (transposedChord.chord.includes("#")) {
                if (transposedChord.chord.includes("DO")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/DO/, "RE").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("RE")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/RE/, "MI").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("FA")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/FA/, "SOL").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("SOL")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/SOL/, "LA").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                } else if (transposedChord.chord.includes("LA")) {
                    transposedChords.push({
                        id: transposedChord.id,
                        chord: transposedChord.chord.replace(/LA/, "SI").slice(0, -1),
                        aboveLine: transposedChord.aboveLine,
                        lineSlot: transposedChord.lineSlot,
                        _id: transposedChord._id
                    });
                }
            } else if (transposedChord.chord.includes("b")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.slice(0, -1),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else if (transposedChord.chord.includes("MI")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.replace(/MI/, "FA"),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else if (transposedChord.chord.includes("SI")) {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord.replace(/SI/, "DO"),
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            } else {
                transposedChords.push({
                    id: transposedChord.id,
                    chord: transposedChord.chord + "#",
                    aboveLine: transposedChord.aboveLine,
                    lineSlot: transposedChord.lineSlot,
                    _id: transposedChord._id
                });
            }
        });
        return transposedChords;
    }

    function transposeSemiAbove() {
        let transposedChords = [];

        if (username == "") {
            if (nomenclatureWritten == "AngloSaxon") {
                transposedChords = angloSaxonTransposeSemiAbove(transposedChords);
            } else {
                transposedChords = latinTransposeSemiAbove(transposedChords);
            }
        } else {
            if (nomenclature == "AngloSaxon") {
                transposedChords = angloSaxonTransposeSemiAbove(transposedChords);
            } else {
                transposedChords = latinTransposeSemiAbove(transposedChords);
            }
        }
        setChords(transposedChords);
    }

    function autoScrollSwitcher() {
        if (!isScrolling) {
            setIsScrolling(true);
            performAutoScroll();
        } else {
            clearTimeout(autoScrollTimeout);
            setIsScrolling(false);
        }
    }

    function performAutoScroll() {
        window.scrollBy(0, autoScrollSpeed);
        let autoScroll = setTimeout(performAutoScroll, 10);
        setAutoScrollTimeout(autoScroll);
    }

    function decreaseAutoScrollSpeed() {
        setAutoScrollSpeed(prevSpeed => {
            if (prevSpeed > 1) {
                return prevSpeed - 1;
            } else {
                return prevSpeed;
            }
        });
    }

    function increaseAutoScrollSpeed() {
        setAutoScrollSpeed(prevSpeed => {
            if (prevSpeed < 10) {
                return prevSpeed + 1;
            } else {
                return prevSpeed;
            }
        });
    }

    function changeFont() {
        let elements = document.getElementsByClassName("lyrics");
        for (let i = 0; i < elements.length; i++) {
            elements[i].className = "lyrics font" + fontTypes[currentFontTypeIndex].replace(" ", "") + " " + fontSizes[currentFontSizeIndex];
        }
    }

    function fontTypesBackwards() {
        setCurrentFontTypeIndex(prevIndex => {
            if (prevIndex > 0) {
                return prevIndex - 1;
            } else {
                return prevIndex;
            }
        });
    }

    function fontTypesUpwards() {
        setCurrentFontTypeIndex(prevIndex => {
            if (prevIndex < 6) {
                return prevIndex + 1;
            } else {
                return prevIndex;
            }
        });
    }

    function fontSizesBackwards() {
        setCurrentFontSizeIndex(prevIndex => {
            if (prevIndex > 0) {
                return prevIndex - 1;
            } else {
                return prevIndex;
            }
        });
    }

    function fontSizesUpwards() {
        setCurrentFontSizeIndex(prevIndex => {
            if (prevIndex < 2) {
                return prevIndex + 1;
            } else {
                return prevIndex;
            }
        });
    }

    function downloadMainColumnsAsPDF() {
        let mainColumn = document.getElementById("download");
        let firstLetter = title.charAt(0).toUpperCase();
        let preparedTitle = firstLetter + title.substring(1);
        let preparedSinger = singer.replace(" ", "");
        const opt = {
            margin: 20,
            filename: preparedTitle + 'By' + preparedSinger + 'Transcript.pdf',
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: {scale: 2},
            jsPDF: {unit: 'mm', format: 'a1', orientation: 'p'}
        };
        html2pdf().from(mainColumn).set(opt).save();
    }

    function savedByUser(e) {
        e.preventDefault();

        fetch('/api/transcripts')
            .then(res => res.json())
            .then(savedTranscripts => {
                savedTranscripts.forEach(savedTranscript => {
                    if (savedTranscript.singer.toUpperCase() == singer.toUpperCase() && savedTranscript.title.toUpperCase() == title.toUpperCase()) {
                        if (!savedTranscript.savedByUsers.includes(username)) {
                            savedTranscript.savedByUsers.push(username);
                            fetch(`/api/transcripts/${savedTranscript._id}`, {
                                method: 'PUT', body: JSON.stringify(savedTranscript), headers: {
                                    'Accept': 'application/json', 'Content-Type': 'application/json'
                                }
                            }).catch(err => console.error(err));
                        }
                    }
                });
            }).catch(err => console.error(err));
        e.preventDefault();
    }

    function editTranscriptClicked() {
        props.onClick(transcriptId);
    }

    function commonToolsColumn() {
        return (<>
            <Row className={"mt-xl-1 stickyHeaderDisplay"}>
                <h5>Eines:</h5>
                <hr/>
            </Row>
            <Row className={"d-flex justify-content-center mt-xl-1"}>
                <Button className={"btnTools btn-dark nopadding"} onClick={simplifyChords}>
                    Simplificar
                </Button>
            </Row>
            <Row className={"d-flex justify-content-center mt-xl-1"}>
                <Button className={"btnToolsSmall btn-dark nopadding"} onClick={transposeSemiBelow}>
                    -
                </Button>
                <Button className={"btnToolsMedium btn-dark nopadding"} disabled={true}>
                    Transposar
                </Button>
                <Button className={"btnToolsSmall btn-dark nopadding"} onClick={transposeSemiAbove}>
                    +
                </Button>
            </Row>
            <Row className={"d-flex justify-content-center mt-xl-1"}>
                <Button className={"btnToolsSmall btn-dark nopadding"} onClick={decreaseAutoScrollSpeed}>
                    -
                </Button>
                <Button className={"btnToolsMedium btn-dark nopadding"} onClick={autoScrollSwitcher}>
                    Desplaçar
                </Button>
                <Button className={"btnToolsSmall btn-dark nopadding"} onClick={increaseAutoScrollSpeed}>
                    +
                </Button>
            </Row>
            <Row className={"d-flex justify-content-center mt-xl-1"}>
                <Button className={"btnTools btn-dark nopadding"} onClick={changeFont}>
                    Assignar lletra
                </Button>
            </Row>
            <Row className={"d-flex justify-content-center mt-xl-1"}>
                <Button className={"btnToolsSmallFont btn-dark nopadding"} onClick={fontTypesBackwards}>
                    {"<"}
                </Button>
                <Button className={"btnToolsMediumFont btn-dark nopadding"} disabled={true}>
                    {fontTypes[currentFontTypeIndex].replace("font", "")}
                </Button>
                <Button className={"btnToolsSmallFont btn-dark nopadding"} onClick={fontTypesUpwards}>
                    {">"}
                </Button>
            </Row>
            <Row className={"d-flex justify-content-center mt-xl-1"}>
                <Button className={"btnToolsSmallFont btn-dark nopadding"} onClick={fontSizesBackwards}>
                    {"<"}
                </Button>
                <Button className={"btnToolsMediumFont btn-dark nopadding"} disabled={true}>
                    {fontSizes[currentFontSizeIndex].replace("Font", "").charAt(0).toUpperCase() + fontSizes[currentFontSizeIndex].replace("Font", "").substring(1)}
                </Button>
                <Button className={"btnToolsSmallFont btn-dark nopadding"} onClick={fontSizesUpwards}>
                    {">"}
                </Button>
            </Row>
            <Row className={"d-flex justify-content-center mt-xl-1"}>
                <Button className={"btnTools btn-dark nopadding"} onClick={downloadMainColumnsAsPDF}>
                    Descarregar en PDF
                </Button>
            </Row>
        </>);
    }

    function saveTranscriptRatingClicked(e) {
        fetch(`/api/transcripts/${transcriptId}`)
            .then(res => res.json())
            .then(savedTranscript => {
                let isAlreadyRated = false, updatedUserRatings = [];
                savedTranscript.userRatings.forEach(userRating => {
                    if (userRating.username == username) {
                        userRating.rating = rating;
                        isAlreadyRated = true;
                    }
                    updatedUserRatings.push(userRating);
                });
                if (!isAlreadyRated) {
                    updatedUserRatings.push({rating: rating, username: username});
                }
                let newTranscript = savedTranscript;
                newTranscript.userRatings = updatedUserRatings;
                fetch(`/api/transcripts/${transcriptId}`, {
                    method: 'PUT', body: JSON.stringify(newTranscript), headers: {
                        'Accept': 'application/json', 'Content-Type': 'application/json'
                    }
                }).then(res => {
                    if (res.ok) {
                        toast.success('Rating saved!', {
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
            }).catch(err => console.error(err));
    }

    function buildToolsColumn() {
        if (username != "") {
            return (<Col className={"stickyColumnDisplay"}>
                {commonToolsColumn()}
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btnTools btn-dark nopadding"} onClick={savedByUser}>
                        Guardar
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <Button className={"btnTools btn-dark nopadding"} onClick={editTranscriptClicked}>
                        Editar
                    </Button>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-1"}>
                    <div className="ratingWrapper d-flex justify-content-center">
                        {[...Array(5)].map((star, index) => {
                            const currentRating = index + 1;
                            return (<label>
                                <input
                                    type="radio"
                                    name="rating"
                                    className={"inputRating"}
                                    value={currentRating}
                                    onClick={() => setRating(prevRating => {
                                        if (prevRating == currentRating) {
                                            return 0;
                                        } else {
                                            return currentRating;
                                        }
                                    })}
                                />
                                <FaStar
                                    className='star'
                                    size={25}
                                    color={currentRating <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    onMouseEnter={() => setHover(currentRating)}
                                    onMouseLeave={() => setHover(null)}
                                />
                            </label>);
                        })}
                    </div>
                </Row>
                <Row className={"d-flex justify-content-center mt-xl-2"}>
                    <Button className={"btnTools btn-dark nopadding"} onClick={saveTranscriptRatingClicked}>
                        Guardar Valoració
                    </Button>
                </Row>
            </Col>);
        } else {
            return (<Col className={"stickyColumnDisplay"}>
                {commonToolsColumn()}
            </Col>);
        }
    }

    function buildAngloSaxonLeftHandedChords() {
        let printedChords = [];
        chords.forEach(chord => {
            if (!printedChords.includes(chord.chord)) {
                if (chord.chord == "C") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedCImage}/>
                    </Col>);
                } else if (chord.chord == "Cm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedCmImage}/>
                    </Col>);
                } else if (chord.chord == "C7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedC7Image}/>
                    </Col>);
                } else if (chord.chord == "D") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedDImage}/>
                    </Col>);
                } else if (chord.chord == "Dm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedDmImage}/>
                    </Col>);
                } else if (chord.chord == "D7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedD7Image}/>
                    </Col>);
                } else if (chord.chord == "E") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedEImage}/>
                    </Col>);
                } else if (chord.chord == "Em") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedEmImage}/>
                    </Col>);
                } else if (chord.chord == "E7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedE7Image}/>
                    </Col>);
                } else if (chord.chord == "F") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedFImage}/>
                    </Col>);
                } else if (chord.chord == "Fm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedFmImage}/>
                    </Col>);
                } else if (chord.chord == "F7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedF7Image}/>
                    </Col>);
                } else if (chord.chord == "G") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedGImage}/>
                    </Col>);
                } else if (chord.chord == "Gm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedGmImage}/>
                    </Col>);
                } else if (chord.chord == "G7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedG7Image}/>
                    </Col>);
                } else if (chord.chord == "A") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedAImage}/>
                    </Col>);
                } else if (chord.chord == "Am") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedAmImage}/>
                    </Col>);
                } else if (chord.chord == "A7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedA7Image}/>
                    </Col>);
                } else if (chord.chord == "B") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedBImage}/>
                    </Col>);
                } else if (chord.chord == "Bm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedBmImage}/>
                    </Col>);
                } else if (chord.chord == "B7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedB7Image}/>
                    </Col>);
                }
                printedChords.push(chord.chord);
            }
        });
    }

    function buildLatinLeftHandedChords() {
        let printedChords = [];
        chords.forEach(chord => {
            if (!printedChords.includes(chord.chord)) {
                if (chord.chord == "DO") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedCImage}/>
                    </Col>);
                } else if (chord.chord == "DOm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedCmImage}/>
                    </Col>);
                } else if (chord.chord == "DO7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedC7Image}/>
                    </Col>);
                } else if (chord.chord == "RE") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedDImage}/>
                    </Col>);
                } else if (chord.chord == "REm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedDmImage}/>
                    </Col>);
                } else if (chord.chord == "RE7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedD7Image}/>
                    </Col>);
                } else if (chord.chord == "RE") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedEImage}/>
                    </Col>);
                } else if (chord.chord == "REm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedEmImage}/>
                    </Col>);
                } else if (chord.chord == "RE7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedE7Image}/>
                    </Col>);
                } else if (chord.chord == "FA") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedFImage}/>
                    </Col>);
                } else if (chord.chord == "FAm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedFmImage}/>
                    </Col>);
                } else if (chord.chord == "FA7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedF7Image}/>
                    </Col>);
                } else if (chord.chord == "SOL") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedGImage}/>
                    </Col>);
                } else if (chord.chord == "SOLm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedGmImage}/>
                    </Col>);
                } else if (chord.chord == "SOL7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedG7Image}/>
                    </Col>);
                } else if (chord.chord == "LA") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedAImage}/>
                    </Col>);
                } else if (chord.chord == "LAm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedAmImage}/>
                    </Col>);
                } else if (chord.chord == "LA7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedA7Image}/>
                    </Col>);
                } else if (chord.chord == "SI") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedBImage}/>
                    </Col>);
                } else if (chord.chord == "SIm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedBmImage}/>
                    </Col>);
                } else if (chord.chord == "SI7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={leftHandedB7Image}/>
                    </Col>);
                }
                printedChords.push(chord.chord);
            }
        });
    }

    function buildAngloSaxonRightHandedChords() {
        let printedChords = [];
        chords.forEach(chord => {
            if (!printedChords.includes(chord.chord)) {
                if (chord.chord == "C") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedCImage}/>
                    </Col>);
                } else if (chord.chord == "Cm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedCmImage}/>
                    </Col>);
                } else if (chord.chord == "C7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedC7Image}/>
                    </Col>);
                } else if (chord.chord == "D") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedDImage}/>
                    </Col>);
                } else if (chord.chord == "Dm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedDmImage}/>
                    </Col>);
                } else if (chord.chord == "D7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedD7Image}/>
                    </Col>);
                } else if (chord.chord == "E") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedEImage}/>
                    </Col>);
                } else if (chord.chord == "Em") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedEmImage}/>
                    </Col>);
                } else if (chord.chord == "E7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedE7Image}/>
                    </Col>);
                } else if (chord.chord == "F") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedFImage}/>
                    </Col>);
                } else if (chord.chord == "Fm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedFmImage}/>
                    </Col>);
                } else if (chord.chord == "F7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedF7Image}/>
                    </Col>);
                } else if (chord.chord == "G") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedGImage}/>
                    </Col>);
                } else if (chord.chord == "Gm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedGmImage}/>
                    </Col>);
                } else if (chord.chord == "G7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedG7Image}/>
                    </Col>);
                } else if (chord.chord == "A") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedAImage}/>
                    </Col>);
                } else if (chord.chord == "Am") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedAmImage}/>
                    </Col>);
                } else if (chord.chord == "A7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedA7Image}/>
                    </Col>);
                } else if (chord.chord == "B") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedBImage}/>
                    </Col>);
                } else if (chord.chord == "Bm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedBmImage}/>
                    </Col>);
                } else if (chord.chord == "B7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedB7Image}/>
                    </Col>);
                }
                printedChords.push(chord.chord);
            }
        });
    }

    function buildLatinRightHandedChords() {
        let printedChords = [];
        chords.forEach(chord => {
            if (!printedChords.includes(chord.chord)) {
                if (chord.chord == "DO") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedCImage}/>
                    </Col>);
                } else if (chord.chord == "DOm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedCmImage}/>
                    </Col>);
                } else if (chord.chord == "DO7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedC7Image}/>
                    </Col>);
                } else if (chord.chord == "RE") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedDImage}/>
                    </Col>);
                } else if (chord.chord == "REm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedDmImage}/>
                    </Col>);
                } else if (chord.chord == "RE7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedD7Image}/>
                    </Col>);
                } else if (chord.chord == "MI") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedEImage}/>
                    </Col>);
                } else if (chord.chord == "MIm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedEmImage}/>
                    </Col>);
                } else if (chord.chord == "MI7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedE7Image}/>
                    </Col>);
                } else if (chord.chord == "FA") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedFImage}/>
                    </Col>);
                } else if (chord.chord == "FAm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedFmImage}/>
                    </Col>);
                } else if (chord.chord == "FA7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedF7Image}/>
                    </Col>);
                } else if (chord.chord == "SOL") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedGImage}/>
                    </Col>);
                } else if (chord.chord == "SOLm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedGmImage}/>
                    </Col>);
                } else if (chord.chord == "SOL7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedG7Image}/>
                    </Col>);
                } else if (chord.chord == "LA") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedAImage}/>
                    </Col>);
                } else if (chord.chord == "LAm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedAmImage}/>
                    </Col>);
                } else if (chord.chord == "LA7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedA7Image}/>
                    </Col>);
                } else if (chord.chord == "SI") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedBImage}/>
                    </Col>);
                } else if (chord.chord == "SIm") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5 className={"pe-xl-3"}>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedBmImage}/>
                    </Col>);
                } else if (chord.chord == "SI7") {
                    chordsImages.push(<Col className={"d-flex justify-content-center"}>
                        <h5>{chord.chord + ":"}</h5>
                        <img className={"chordImage"} src={rightHandedB7Image}/>
                    </Col>);
                }
                printedChords.push(chord.chord);
            }
        });
    }

    function buildChordsImages() {
        if (username != "") {
            if (nomenclature == "AngloSaxon") {
                if (mainHand == "LeftHanded") {
                    buildAngloSaxonLeftHandedChords();
                } else {
                    buildAngloSaxonRightHandedChords();
                }
            } else {
                if (mainHand == "LeftHanded") {
                    buildLatinLeftHandedChords();
                } else {
                    buildLatinRightHandedChords();
                }
            }
        } else {
            if (nomenclatureWritten == "AngloSaxon") {
                if (mainHand == "LeftHanded") {
                    buildAngloSaxonLeftHandedChords();
                } else {
                    buildAngloSaxonRightHandedChords();
                }
            } else {
                if (mainHand == "LeftHanded") {
                    buildLatinLeftHandedChords();
                } else {
                    buildLatinRightHandedChords();
                }
            }
        }
    }

    buildRhythmsStructure();
    buildChordsImages();
    buildTranscriptStructure();
    buildToolsColumn();

    return <>
        <Row className={"d-flex justify-content-center mainRow"}>
            <Col className={"mainColumn"} id={"download"}>
                <Row className={"mt-xl-5"}>
                    <Col className={"d-flex justify-content-center"}>
                        <Col>
                            <h2>{title} de {singer}</h2>
                        </Col>
                    </Col>
                </Row>

                <Row className={"mt-xl-5"}>
                    <Col className={"d-flex justify-content-center"}>
                        <Col>
                            <h5>
                                Dificultat: <span className={"extraInfoDisplay"}>{difficulty}</span>
                            </h5>
                        </Col>
                    </Col>
                </Row>

                <Row>
                    <Col className={"d-flex justify-content-center"}>
                        <Col>
                            <h5>
                                Celleta: <span className={"extraInfoDisplay"}>{capo}</span>
                            </h5>
                        </Col>
                    </Col>
                </Row>

                <Row>
                    <Col className={"d-flex justify-content-center"}>
                        <Col>
                            <h5>
                                Tonalitat: <span className={"extraInfoDisplay"}>{keyWritten}</span>
                            </h5>
                        </Col>
                    </Col>
                    <Col className={"d-flex justify-content-center"}>
                        <iframe width="560" height="315" src={youtubeLink}
                                title="YouTube video player" frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen></iframe>
                    </Col>
                </Row>

                <Row>
                    <Col className={"mt-xl-5"}>
                        <Col>
                            <h4>Rascats:</h4>
                            <hr/>
                            {rhythmStruct}
                        </Col>
                    </Col>
                </Row>

                <Row>
                    <Col className={"mt-xl-5"}>
                        <Col>
                            <h4>Acords:</h4>
                            <hr/>
                            <Row>
                                {chordsImages}
                            </Row>
                        </Col>
                    </Col>
                </Row>

                <Row>
                    <Col className={"d-flex justify-content-center mt-xl-5"}>
                        <Col>
                            <h4>Transcripció:</h4>
                            <hr/>
                            {transcriptStruct}
                        </Col>
                    </Col>
                </Row>
            </Col>
            {buildToolsColumn()}
        </Row>
    </>
}