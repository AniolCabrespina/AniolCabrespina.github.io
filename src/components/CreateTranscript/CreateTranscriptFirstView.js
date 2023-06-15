import {Col, FormControl, Row} from "react-bootstrap";
import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import {toast} from "react-toastify";

export function CreateTranscriptFirstView(props) {
    const [nextViewIndex] = useState(1);
    const [singer, setSinger] = useState("");
    const [title, setTitle] = useState("");
    const [lyrics, setLyrics] = useState("");

    let lyricsArray;

    function handleSingerChange(e) {
        setSinger(e.target.value);
    }

    function handleTitleChange(e) {
        setTitle(e.target.value);
    }

    function handleLyricsChange(e) {
        setLyrics(e.target.value);
    }

    function handleOnClick(e) {
        let isValid = true;
        e.preventDefault();

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

    return <>
        <Row className={"mt-xl-5"}>
            <Col/>
            <Col xs={8} className={"d-flex justify-content-center"}>
                <Col>
                    <h5>Cantant:</h5>
                    <FormControl name={"singer"} type={"text"} placeholder={"Miley Cyrus"}
                                 onChange={handleSingerChange}/>
                </Col>
                <Col/>
                <Col>
                    <h5>Títol:</h5>
                    <FormControl name={"title"} type={"text"} placeholder={"Flowers"} onChange={handleTitleChange}/>
                </Col>
            </Col>
            <Col/>
        </Row>

        <Row className={"d-flex justify-content-center mt-xl-5"}>
            <Col/>
            <Col xs={8}>
                <h5>Lletra de la cançó:</h5>
                <FormControl as={"textarea"} placeholder={"Introdueix la lletra aquí"} style={{height: '300px'}}
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