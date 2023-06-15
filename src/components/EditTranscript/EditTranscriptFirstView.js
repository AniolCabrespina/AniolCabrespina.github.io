import {Col, FormControl, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import {useLocation} from "react-router-dom";
import {toast} from "react-toastify";

export function EditTranscriptFirstView(props) {
    const location = useLocation();

    const [nextViewIndex] = useState(1);
    const [singer, setSinger] = useState("");
    const [title, setTitle] = useState("");
    const [lyrics, setLyrics] = useState([]);

    const [lyricsUntouched, setLyricsUntouched] = useState(true);
    const [savedLyrics, setSavedLyrics] = useState([]);

    let lyricsArray;

    useEffect(() => {
        fetch(`/api/transcripts/${location.state.transcriptId}`)
            .then(res => res.json())
            .then(savedTranscript => {
                setSinger(savedTranscript.singer);
                setTitle(savedTranscript.title);
                setLyrics(savedTranscript.lyrics.join(""));
                setSavedLyrics(savedTranscript.lyrics);

                let singerInput = document.getElementById("singer");
                singerInput.value = savedTranscript.singer;
                let titleInput = document.getElementById("title");
                titleInput.value = savedTranscript.title;
                let lyricsTextArea = document.getElementById("lyrics");
                lyricsTextArea.value = savedTranscript.lyrics.join("\n");
            }).catch(err => console.error(err));
    }, []);

    function handleSingerChange(e) {
        setSinger(e.target.value);
    }

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleLyricsChange(e) {
        setLyricsUntouched(false);
        setLyrics(e.target.value);
    }

    function handleOnClick(e) {
        e.preventDefault();
        if (lyricsUntouched) {
            props.onClick(nextViewIndex, singer, title, savedLyrics);
        } else {
            let isValid = true;

            if (singer == "") {
                isValid = false;
                toast.error('ERROR: Singer can not be empty', {
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
            if (title == "") {
                isValid = false;
                toast.error('ERROR: Title can not be empty', {
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
            if (lyrics == "") {
                isValid = false;
                toast.error('ERROR: Lyrics can not be empty', {
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

            if (isValid) {
                lyricsArray = lyrics;
                lyricsArray = lyricsArray.split('\n');
                props.onClick(nextViewIndex, singer, title, lyricsArray);
            }
        }
    }

    return <>
        <Row className={"mt-xl-5"}>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h5>Cantant:</h5>
                    <FormControl id={"singer"} name={"singer"} type={"text"} placeholder={"Miley Cyrus"}
                                 onChange={handleSingerChange}/>
                </Col>
                <Col/>
                <Col>
                    <h5>Títol:</h5>
                    <FormControl id={"title"} name={"title"} type={"text"} placeholder={"Flowers"}
                                 onChange={handleTitleChange}/>
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row className={"d-flex justify-content-center mt-xl-5"}>
            <Col/>
            <Col xs={8}>
                <h5>Lletra de la cançó:</h5>
                <FormControl id={"lyrics"} as={"textarea"} placeholder={"Introdueix la lletra aquí"}
                             style={{height: '300px'}}
                             onChange={handleLyricsChange}/>
            </Col>
            <Col/>
        </Row>

        <Row className={"d-flex justify-content-center mt-xl-5"}>
            <Col/>
            <Col xs={8}>
                <Button className={"btn btn-dark"} onClick={handleOnClick}>Següent</Button>
            </Col>
            <Col/>
        </Row>
    </>
}