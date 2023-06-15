import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {buildChordsLine} from "../Utilities/BuildChordsLine";
import {useLocation} from "react-router-dom";

export function EditTranscriptFifthView(props) {
    const location = useLocation();
    const [mainHand] = useState(props.mainHand);
    const [nomenclature] = useState(props.nomenclature);

    const [nextViewIndex] = useState(5);
    const [singer] = useState(props.singer);
    const [title] = useState(props.title);
    const [lyrics] = useState(...props.lyrics);
    const [labels] = useState(...props.labels);
    const [chords] = useState(...props.chords);
    const [tabs, setTabs] = useState([]);
    const [nomenclatureWritten, setNomenclatureWritten] = useState("");

    const [tabsStruct, setTabsStruct] = useState([]);

    function translateLineChords(lineChords, nomenclatureWritten) {
        if (nomenclature != nomenclatureWritten) {
            if (nomenclature == "AngloSaxon") {
                lineChords.forEach(lineChord => {
                    if (lineChord.chord.includes("DO")) {
                        lineChord.chord = lineChord.chord.replace("DO", "C");
                    } else if (lineChord.chord.includes("RE")) {
                        lineChord.chord = lineChord.chord.replace("RE", "D");
                    } else if (lineChord.chord.includes("MI")) {
                        lineChord.chord = lineChord.chord.replace("MI", "E");
                    } else if (lineChord.chord.includes("FA")) {
                        lineChord.chord = lineChord.chord.replace("FA", "F");
                    } else if (lineChord.chord.includes("SOL")) {
                        lineChord.chord = lineChord.chord.replace("SOL", "G");
                    } else if (lineChord.chord.includes("LA")) {
                        lineChord.chord = lineChord.chord.replace("LA", "A");
                    } else if (lineChord.chord.includes("SI")) {
                        lineChord.chord = lineChord.chord.replace("SI", "B");
                    }
                });
            } else {
                lineChords.forEach(lineChord => {
                    if (lineChord.chord.includes("C")) {
                        lineChord.chord = lineChord.chord.replace("C", "DO");
                    } else if (lineChord.chord.includes("D")) {
                        lineChord.chord = lineChord.chord.replace("D", "RE");
                    } else if (lineChord.chord.includes("E")) {
                        lineChord.chord = lineChord.chord.replace("E", "MI");
                    } else if (lineChord.chord.includes("F")) {
                        lineChord.chord = lineChord.chord.replace("F", "FA");
                    } else if (lineChord.chord.includes("G")) {
                        lineChord.chord = lineChord.chord.replace("G", "SOL");
                    } else if (lineChord.chord.includes("A")) {
                        lineChord.chord = lineChord.chord.replace("A", "LA");
                    } else if (lineChord.chord.includes("B")) {
                        lineChord.chord = lineChord.chord.replace("B", "SI");
                    }
                });
            }
        }
        return lineChords;
    }

    useEffect(() => {
        fetch(`/api/transcripts/${location.state.transcriptId}`)
            .then(res => res.json())
            .then(savedTranscript => {
                setTabs(savedTranscript.tabs);
                setNomenclatureWritten(savedTranscript.nomenclatureWritten);
                setTabsStruct(prevState => {
                    let currentLine = 0, currentLabel = 0, currentLabelAboveLine = -1;
                    let label, line, renderFragment, builtTabStructure = [];

                    while (lyrics.length > currentLine) {
                        if (labels.length !== 0) {
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
                            builtTabStructure.push(renderFragment);
                            currentLine++;
                        } else {
                            let lineChords = [], savedTab = {}, isSavedTab = false;

                            savedTranscript.tabs.forEach(tab => {
                                if (tab.belowLine == currentLine) {
                                    savedTab = tab;
                                    isSavedTab = true;
                                }
                            });
                            chords.forEach(chord => {
                                if (chord.aboveLine == currentLine) {
                                    lineChords.push(chord);
                                }
                            });
                            lineChords.sort(function (chordA, chordB) {
                                return chordA.lineSlot - chordB.lineSlot
                            });

                            lineChords = translateLineChords(lineChords, savedTranscript.nomenclatureWritten);

                            if (currentLine == currentLabelAboveLine) {
                                if (isSavedTab) {
                                    renderFragment = (<div key={currentLine}>
                                        <Row className={"d-flex justify-content-center mt-xl-4 clearFloat"}>
                                            <h5>{label.labelType}:</h5>
                                        </Row>
                                        <Row className={"row nopadding"}>
                                            {buildChordsLine(currentLine, lineChords, nomenclature)}
                                        </Row>
                                        <Row className={"clearFloat"}>
                                            <p className={"lyricsDisplay"}>{line}</p>
                                        </Row>
                                        <Row className={"tabRow nopadding"}>
                                            {buildEditTabLine(savedTab)}
                                        </Row>
                                    </div>);
                                    builtTabStructure.push(renderFragment);
                                    if (labels.length - 1 > currentLabel) {
                                        currentLabel++;
                                    }
                                } else {
                                    renderFragment = (<div key={currentLine}>
                                        <Row className={"d-flex justify-content-center mt-xl-4 clearFloat"}>
                                            <h5>{label.labelType}:</h5>
                                        </Row>
                                        <Row className={"row nopadding"}>
                                            {buildChordsLine(currentLine, lineChords, nomenclature)}
                                        </Row>
                                        <Row className={"clearFloat"}>
                                            <p className={"lyricsDisplay"}>{line}</p>
                                        </Row>
                                        <Row className={"tabRow nopadding"}>
                                            {buildAddTabButton(currentLine)}
                                        </Row>
                                    </div>);
                                    builtTabStructure.push(renderFragment);
                                    if (labels.length - 1 > currentLabel) {
                                        currentLabel++;
                                    }
                                }
                            } else {
                                if (isSavedTab) {
                                    renderFragment = (<div key={currentLine}>
                                        <Row className={"row nopadding"}>
                                            {buildChordsLine(currentLine, lineChords, nomenclature)}
                                        </Row>
                                        <Row className={"clearFloat"}>
                                            <p className={"lyricsDisplay"}>{line}</p>
                                        </Row>
                                        <Row className={"tabRow nopadding"}>
                                            {buildEditTabLine(savedTab)}
                                        </Row>
                                    </div>);
                                    builtTabStructure.push(renderFragment);
                                } else {
                                    renderFragment = (<div key={currentLine}>
                                        <Row className={"row nopadding"}>
                                            {buildChordsLine(currentLine, lineChords, nomenclature)}
                                        </Row>
                                        <Row className={"clearFloat"}>
                                            <p className={"lyricsDisplay"}>{line}</p>
                                        </Row>
                                        <Row className={"tabRow nopadding"}>
                                            {buildAddTabButton(currentLine)}
                                        </Row>
                                    </div>);
                                    builtTabStructure.push(renderFragment);
                                }
                            }
                            currentLine++;
                        }
                    }
                    return [...prevState, builtTabStructure];
                });
            }).catch(err => console.error(err));
    }, []);

    function handleOnClick(e) {
        e.preventDefault();
        let filledTabs = [];
        tabs.forEach(tab => {
            let isTabEmpty = true;
            tab.tabInputs.forEach(tabInput => {
                if (tabInput.textInput != "") {
                    isTabEmpty = false;
                }
            });
            if (!isTabEmpty) {
                filledTabs.push(tab);
            }
        });
        props.onClick(nextViewIndex, filledTabs, nomenclatureWritten);
    }

    function handleTabInputChange(e) {
        setTabs(prevTabs => {
            let found = false;
            if (prevTabs.length == 0) {
                return ([...prevTabs, {
                    tabInputs: [{
                        string: e.target.dataset.string, slot: e.target.dataset.slot, textInput: e.target.value
                    }], belowLine: e.target.dataset.belowline,
                }]);
            } else {
                let changedTab = prevTabs.find(tab => {
                    return tab.belowLine === e.target.dataset.belowline
                });
                if (changedTab) {
                    changedTab.tabInputs.forEach(input => {
                        if (input.string == e.target.dataset.string && input.slot == e.target.dataset.slot) {
                            input.textInput = e.target.value;
                            found = true;
                        }
                    });
                    if (!found) {
                        changedTab.tabInputs = [...changedTab.tabInputs, {
                            string: e.target.dataset.string, slot: e.target.dataset.slot, textInput: e.target.value
                        }];
                        found = false;
                    }
                    return (prevTabs);
                } else {
                    return ([...prevTabs, {
                        tabInputs: [{
                            string: e.target.dataset.string, slot: e.target.dataset.slot, textInput: e.target.value
                        }], belowLine: e.target.dataset.belowline,
                    }]);
                }
            }
        });
    }

    function buildTabLine(currentLine) {
        let tabLine = [], strings = 6, element, tmp;

        if (mainHand == "RightHanded") {
            for (let string = 1; string <= strings; string++) {

                element = document.createElement("Row");
                element.className = "nopadding";
                tabLine.push(element);

                element = document.createElement("Col");
                element.className = "col nopadding";

                tmp = document.createElement("p");
                tmp.className = "tabLabel grid nopadding";
                tmp.type = "text";

                if (nomenclature == "AngloSaxon"){
                    switch (string) {
                        case 1:
                            tmp.innerHTML = "e";
                            break;
                        case 2:
                            tmp.innerHTML = "B";
                            break;
                        case 3:
                            tmp.innerHTML = "G";
                            break;
                        case 4:
                            tmp.innerHTML = "D";
                            break;
                        case 5:
                            tmp.innerHTML = "A";
                            break;
                        case 6:
                            tmp.innerHTML = "E";
                            break;
                        default:
                            break;
                    }
                } else {
                    switch (string) {
                        case 1:
                            tmp.innerHTML = "mi";
                            break;
                        case 2:
                            tmp.innerHTML = "SI";
                            break;
                        case 3:
                            tmp.innerHTML = "SOL";
                            break;
                        case 4:
                            tmp.innerHTML = "RE";
                            break;
                        case 5:
                            tmp.innerHTML = "LA";
                            break;
                        case 6:
                            tmp.innerHTML = "MI";
                            break;
                        default:
                            break;
                    }
                }

                element.appendChild(tmp);
                tabLine.push(element);

                for (let slot = 1; slot < 22; slot++) {
                    element = document.createElement("Col");
                    element.className = "col nopadding";

                    tmp = document.createElement("input");
                    tmp.className = "tabInput grid nopadding form-control";
                    tmp.type = "text";
                    tmp.placeholder = "--------";
                    tmp.onchange = handleTabInputChange;
                    tmp.dataset.belowline = currentLine;
                    tmp.dataset.string = string + "";
                    tmp.dataset.slot = slot + "";

                    element.appendChild(tmp);
                    tabLine.push(element);
                }
            }
        } else {
            for (let string = 6; string >= 1; string--) {

                element = document.createElement("Row");
                element.className = "nopadding";
                tabLine.push(element);

                element = document.createElement("Col");
                element.className = "col nopadding";

                tmp = document.createElement("p");
                tmp.className = "tabLabel grid nopadding";
                tmp.type = "text";

                if (nomenclature == "AngloSaxon"){
                    switch (string) {
                        case 1:
                            tmp.innerHTML = "e";
                            break;
                        case 2:
                            tmp.innerHTML = "B";
                            break;
                        case 3:
                            tmp.innerHTML = "G";
                            break;
                        case 4:
                            tmp.innerHTML = "D";
                            break;
                        case 5:
                            tmp.innerHTML = "A";
                            break;
                        case 6:
                            tmp.innerHTML = "E";
                            break;
                        default:
                            break;
                    }
                } else {
                    switch (string) {
                        case 1:
                            tmp.innerHTML = "mi";
                            break;
                        case 2:
                            tmp.innerHTML = "SI";
                            break;
                        case 3:
                            tmp.innerHTML = "SOL";
                            break;
                        case 4:
                            tmp.innerHTML = "RE";
                            break;
                        case 5:
                            tmp.innerHTML = "LA";
                            break;
                        case 6:
                            tmp.innerHTML = "MI";
                            break;
                        default:
                            break;
                    }
                }

                element.appendChild(tmp);
                tabLine.push(element);

                for (let slot = 1; slot < 22; slot++) {
                    element = document.createElement("Col");
                    element.className = "col nopadding";

                    tmp = document.createElement("input");
                    tmp.className = "tabInput grid nopadding form-control";
                    tmp.type = "text";
                    tmp.placeholder = "--------";
                    tmp.onchange = handleTabInputChange;
                    tmp.dataset.belowline = currentLine;
                    tmp.dataset.string = string + "";
                    tmp.dataset.slot = slot + "";

                    element.appendChild(tmp);
                    tabLine.push(element);
                }
            }
        }
        return tabLine;
    }

    function buildEditTabLineSaved(savedTab, string, tabLine) {
        let savedStringInputs = [];

        savedTab.tabInputs.forEach(tabInput => {
            if (tabInput.string == string) {
                savedStringInputs.push(tabInput);
            }
        });

        tabLine.push(<Row className={"nopadding"}></Row>);

        if (nomenclature == "AngloSaxon") {
            switch (string) {
                case 1:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel grid nopadding"} type={"text"}>e</p>
                    </Col>);
                    break;
                case 2:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>B</p>
                    </Col>);
                    break;
                case 3:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>G</p>
                    </Col>);
                    break;
                case 4:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>D</p>
                    </Col>);
                    break;
                case 5:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>A</p>
                    </Col>);
                    break;
                case 6:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>E</p>
                    </Col>);
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
                    break;
                case 2:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>SI</p>
                    </Col>);
                    break;
                case 3:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>SOL</p>
                    </Col>);
                    break;
                case 4:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>RE</p>
                    </Col>);
                    break;
                case 5:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>LA</p>
                    </Col>);
                    break;
                case 6:
                    tabLine.push(<Col className={"col nopadding"}>
                        <p className={"tabLabel nopadding"} type={"text"}>MI</p>
                    </Col>);
                    break;
                default:
                    break;
            }
        }

        for (let slot = 1; slot < 22; slot++) {
            let savedTabInput = {};

            savedStringInputs.forEach(tabInput => {
                if (tabInput.slot == slot) {
                    savedTabInput = tabInput;
                }
            });

            if (savedTab) {
                tabLine.push(<Col className={"col nopadding"}>
                    <input className={"tabInput grid nopadding form-control"} type={"text"} placeholder={"--------"}
                           onChange={handleTabInputChange} data-belowline={savedTab.belowLine}
                           data-string={string + ""}
                           data-slot={slot + ""} defaultValue={savedTabInput.textInput}/>
                </Col>)
            } else {
                tabLine.push(<Col className={"col nopadding"}>
                    <input className={"tabInput grid nopadding form-control"} type={"text"} placeholder={"--------"}
                           onChange={handleTabInputChange} data-belowline={savedTab.belowLine}
                           data-string={string + ""}
                           data-slot={slot + ""}/>
                </Col>)
            }
        }
    }

    function buildEditTabLine(savedTab) {
        let tabLine = [], strings = 6;

        if (mainHand == "RightHanded"){
            for (let string = 1; string <= strings; string++) {
                buildEditTabLineSaved(savedTab, string, tabLine);
            }
        } else {
            for (let string = 6; string >= 1; string--) {
                buildEditTabLineSaved(savedTab, string, tabLine);
            }
        }
        return tabLine;
    }

    function handleOnClickAddTabLine(e) {
        let tabLine = buildTabLine(e.target.dataset.currentline);
        tabLine.forEach(el => {
            e.target.parentNode.appendChild(el)
        })
        e.target.parentNode.removeChild(e.target);
    }

    function buildAddTabButton(currentLine) {
        return <Row className={"mt-xl-3 nopadding"}>
            <Button className={"btn btn-secondary"} onClick={handleOnClickAddTabLine}
                    data-currentline={currentLine}>Click to add tab line
                line</Button>
        </Row>;
    }

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
                <h5>Tabulatures:</h5>
                <hr/>
                {tabsStruct}
            </Col>
            <Col className={"mx-xl-3"}/>
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