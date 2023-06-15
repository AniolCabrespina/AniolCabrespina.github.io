import React, {useState} from "react";
import {Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import {CreateTranscriptFirstView} from "./CreateTranscriptFirstView";
import {CreateTranscriptSecondView} from "./CreateTranscriptSecondView";
import {CreateTranscriptThirdView} from "./CreateTranscriptThirdView";
import {CreateTranscriptFourthView} from "./CreateTranscriptFourthView";
import {CreateTranscriptFifthView} from "./CreateTranscriptFifthView";
import {CreateTranscriptSixthView} from "./CreateTranscriptSixthView";
import {CreateTranscriptPreviewView} from "./CreateTranscriptPreviewView";
import "../../css/CreateTranscriptElements.css"

export function CreateTranscriptView(props) {
    const [username] = useState(props.username);
    const [mainHand] = useState(props.mainHand);
    const [nomenclature] = useState(props.nomenclature);

    const [viewIndex, setViewIndex] = useState(0);
    const [singer, setSinger] = useState("");
    const [title, setTitle] = useState("");
    const [lyrics, setLyrics] = useState([]);
    const [labels, setLabels] = useState([]);
    const [chords, setChords] = useState([]);
    const [rhythms, setRhythms] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [youtubeLink, setYoutubeLink] = useState("");
    const [capo, setCapo] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [keyWritten, setKeyWritten] = useState("");

    let currentView;

    function getFirstData(nextViewIndex, singer, title, lyricsArray) {
        setViewIndex(nextViewIndex);
        setSinger(singer);
        setTitle(title);
        setLyrics([...lyrics, lyricsArray]);
    }

    function getSecondData(nextViewIndex, labelsArray) {
        setViewIndex(nextViewIndex);
        labelsArray.sort(function (labelA, labelB) {
            return labelA.aboveLine - labelB.aboveLine;
        });
        setLabels([...labels, labelsArray]);
        console.log(labelsArray);
    }

    function getThirdData(nextViewIndex, chordsArray) {
        setViewIndex(nextViewIndex);
        setChords([...chords, chordsArray]);
        console.log(chordsArray);
    }

    function getFourthData(nextViewIndex, rhythmArray) {
        setViewIndex(nextViewIndex);
        setRhythms([...rhythms, rhythmArray]);
        console.log(rhythmArray);
    }

    function getFifthData(nextViewIndex, tabsArray) {
        setViewIndex(nextViewIndex);
        setTabs([...tabs, tabsArray]);
        console.log(tabsArray);
    }

    function getSixthData(nextViewIndex, youtubeLink, capo, difficulty, keyWritten) {
        setViewIndex(nextViewIndex);
        setYoutubeLink(youtubeLink);
        setCapo(capo);
        setDifficulty(difficulty);
        setKeyWritten(keyWritten);
    }

    function goHome() {
        props.onClick();
    }

    function displayCurrentView() {
        switch (viewIndex) {
            case 0:
                currentView = <CreateTranscriptFirstView onClick={getFirstData}/>;
                break;
            case 1:
                currentView =
                    <CreateTranscriptSecondView singer={singer} title={title} lyrics={lyrics} onClick={getSecondData}/>;
                break;
            case 2:
                currentView = <CreateTranscriptThirdView mainHand={mainHand}
                                                         nomenclature={nomenclature} singer={singer} title={title}
                                                         lyrics={lyrics} labels={labels}
                                                         onClick={getThirdData}/>;
                break;
            case 3:
                currentView =
                    <CreateTranscriptFourthView singer={singer} title={title} labels={labels} onClick={getFourthData}/>;
                break;
            case 4:
                currentView = <CreateTranscriptFifthView mainHand={mainHand}
                                                         nomenclature={nomenclature} singer={singer} title={title}
                                                         lyrics={lyrics}
                                                         labels={labels}
                                                         chords={chords}
                                                         onClick={getFifthData}/>;
                break;
            case 5:
                currentView =
                    <CreateTranscriptSixthView mainHand={mainHand}
                                               nomenclature={nomenclature} username={username} singer={singer}
                                               title={title} lyrics={lyrics}
                                               labels={labels}
                                               chords={chords}
                                               rhythms={rhythms}
                                               tabs={tabs} onClick={getSixthData} onSave={goHome}/>;
                break;
            case 6:
                currentView = <CreateTranscriptPreviewView mainHand={mainHand}
                                                           nomenclature={nomenclature} username={username}
                                                           singer={singer}
                                                           title={title} lyrics={lyrics}
                                                           labels={labels}
                                                           chords={chords}
                                                           rhythms={rhythms}
                                                           tabs={tabs} youtubeLink={youtubeLink} capo={capo}
                                                           difficulty={difficulty}
                                                           keyWritten={keyWritten} onClick={goHome}/>;
                break;
            default:
                break;
        }
    }

    displayCurrentView();

    return <>
        <Container className={"align-items-center"}>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={8} className={"d-flex justify-content-center"}>
                    <h1>EINA DE CREACIÓ DE XIFRATS</h1>
                </Col>
                <Col/>
            </Row>
            {currentView}
        </Container>
    </>
}