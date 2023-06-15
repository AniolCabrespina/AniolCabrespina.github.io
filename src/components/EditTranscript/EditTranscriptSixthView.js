import {Col, FormControl, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useLocation} from "react-router-dom";
import {toast} from "react-toastify";

export function EditTranscriptSixthView(props) {
    const location = useLocation();

    const [username] = useState(props.username);
    const [mainHand] = useState(props.mainHand);
    const [nomenclature] = useState(props.nomenclature);

    const [nextViewIndex] = useState(6);
    const [singer] = useState(props.singer);
    const [title] = useState(props.title);
    const [lyrics] = useState(...props.lyrics);
    const [labels] = useState(...props.labels);
    const [chords] = useState(...props.chords);
    const [rhythms] = useState(...props.rhythms);
    const [tabs] = useState(...props.tabs)
    const [youtubeLink, setYoutubeLink] = useState("");
    const [capo, setCapo] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [keyWritten, setKeyWritten] = useState("");

    function handleYoutubeLinkChange(e) {
        setYoutubeLink(e.target.value);
    }

    function handleCapoChange(e) {
        setCapo(e.target.value);
    }

    function handleDifficultyChange(e) {
        setDifficulty(e.target.value);
    }

    function handleKeyChange(e) {
        setKeyWritten(e.target.value);
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

        fetch(`/api/transcripts/${location.state.transcriptId}`)
            .then(res => res.json())
            .then(savedTranscript => {
                if (savedTranscript.owningUsers.includes(username)) {

                    transcript.transcriptId = savedTranscript.transcriptId;
                    transcript.owningUsers = savedTranscript.owningUsers;
                    transcript.isPublished = savedTranscript.isPublished;

                    fetch(`/api/transcripts/${location.state.transcriptId}`, {
                        method: 'PUT', body: JSON.stringify(transcript), headers: {
                            'Accept': 'application/json', 'Content-Type': 'application/json'
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

                } else {

                    fetch('/api/transcripts', {
                        method: 'POST', body: JSON.stringify(transcript), headers: {
                            'Accept': 'application/json', 'Content-Type': 'application/json'
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

                }
            }).catch(err => console.error(err));
        e.preventDefault();
        props.onSave();
    }

    function handleOnPreviewClick(e) {
        e.preventDefault();
        props.onClick(nextViewIndex, youtubeLink, capo, difficulty, keyWritten);
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

        fetch(`/api/transcripts/${location.state.transcriptId}`)
            .then(res => res.json())
            .then(savedTranscript => {
                if (savedTranscript.owningUsers.includes(username)) {

                    transcript.transcriptId = savedTranscript.transcriptId;
                    transcript.owningUsers = savedTranscript.owningUsers;

                    console.log(transcript.nomenclatureWritten);
                    console.log(nomenclature);

                    fetch(`/api/transcripts/${location.state.transcriptId}`, {
                        method: 'PUT', body: JSON.stringify(transcript), headers: {
                            'Accept': 'application/json', 'Content-Type': 'application/json'
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

                } else {

                    fetch('/api/transcripts', {
                        method: 'POST', body: JSON.stringify(transcript), headers: {
                            'Accept': 'application/json', 'Content-Type': 'application/json'
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

                }
            }).catch(err => console.error(err));
        e.preventDefault();
        props.onSave();
    }

    useEffect(() => {
        fetch(`/api/transcripts/${location.state.transcriptId}`)
            .then(res => res.json())
            .then(savedTranscript => {
                setYoutubeLink(savedTranscript.youtubeLink);
                let youtubeLinkForm = document.getElementsByName("youtubeLink");
                youtubeLinkForm[0].value = savedTranscript.youtubeLink;

                setCapo(savedTranscript.capo);
                let capoForm = document.getElementsByName("capo");
                capoForm[0].value = savedTranscript.capo;

                setDifficulty(savedTranscript.difficulty);
                let difficultyForm = document.getElementsByName("difficulty");
                difficultyForm[0].value = savedTranscript.difficulty;

                setKeyWritten(savedTranscript.keyWritten);
                let keyWrittenForm = document.getElementsByName("keyWritten");
                keyWrittenForm[0].value = savedTranscript.keyWritten;
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

        <Row className={"mt-xl-5"}>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h5>{"Enllaç de YouTube:"}</h5>
                    <FormControl name={"youtubeLink"} type={"text"}
                                 placeholder={"https://www.youtube.com/watch?v=G7KNmW9a75Y"}
                                 onChange={handleYoutubeLinkChange}/>
                </Col>
                <Col/>
                <Col>
                    <h5>{"Traste de la celleta:"}</h5>
                    <FormControl name={"capo"} type={"text"} placeholder={"Sense"} onChange={handleCapoChange}/>
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row className={"mt-xl-5"}>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h5>{"Dificultat:"}</h5>
                    <FormControl name={"difficulty"} type={"text"} placeholder={"Intermèdia"}
                                 onChange={handleDifficultyChange}/>
                </Col>
                <Col/>
                <Col>
                    <h5>{"Tonalitat:"}</h5>
                    <FormControl name={"keyWritten"} type={"text"} placeholder={"Am"} onChange={handleKeyChange}/>
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row className={"d-flex justify-content-center mt-xl-5"}>
            <Col/>
            <Col className={"d-flex justify-content-center"}><Button className={"btn btn-dark"}
                                                                     onClick={handleOnSaveClick}>Guardar</Button></Col>
            <Col/>
            <Col className={"d-flex justify-content-center"}><Button className={"btn btn-dark"}
                                                                     onClick={handleOnPreviewClick}>Vista
                Prèvia</Button></Col>
            <Col/>
            <Col className={"d-flex justify-content-center"}><Button className={"btn btn-dark"}
                                                                     onClick={handleOnPublishClick}>Publicar</Button></Col>
            <Col/>
        </Row>
    </>
}