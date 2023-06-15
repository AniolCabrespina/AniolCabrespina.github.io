import {Col, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {buildChordsLine} from "../Utilities/BuildChordsLine";

export function CreateTranscriptFifthView(props) {
    const [mainHand] = useState(props.mainHand);
    const [nomenclature] = useState(props.nomenclature);

    const [nextViewIndex] = useState(5);
    const [singer] = useState(props.singer);
    const [title] = useState(props.title);
    const [lyrics] = useState(...props.lyrics);
    const [labels] = useState(...props.labels);
    const [chords] = useState(...props.chords);
    const [tabs, setTabs] = useState([]);

    const [tabsStruct, setTabsStruct] = useState([]);

    useEffect(() => {
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
                        {buildAddTabButton(currentLine)}
                    </Row>
                </div>);

                builtTabStructure.push(renderFragment);
            }
            currentLine++;
        }
        setTabsStruct(prevState => [...prevState, builtTabStructure])
    }, []);

    function handleOnClick(e) {
        e.preventDefault();
        let filledTabs = [];
        tabs.forEach(tab => {
            let isTabEmpty = true;
            tab.tabInputs.forEach(tabInput => {
                if (tabInput.textInput != ""){
                    isTabEmpty = false;
                }
            });
            if (!isTabEmpty){ filledTabs.push(tab); }
        });
        props.onClick(nextViewIndex, filledTabs);
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