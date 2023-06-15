import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {FaStar} from "react-icons/fa";
import {toast} from "react-toastify";

export function CollectionView(props) {
    const [username] = useState(props.username);
    const [transcriptsList, setTranscriptsList] = useState([]);
    const [addedOwningUsers, setAddedOwningUsers] = useState([]);

    function handleSongClicked(e) {
        props.onClick(e.target.dataset.singer, e.target.dataset.title, e.target.dataset.owningusers);
    }

    function handleAddOwningUserChange(e) {
        setAddedOwningUsers(prevAddedOwningUsers => {
            let isUsernameNew = true;
            if (prevAddedOwningUsers.length == 0) {
                return [...prevAddedOwningUsers, {
                    username: e.target.value, transcriptId: e.target.dataset.transcriptid
                }];
            } else {
                prevAddedOwningUsers.forEach(addedOwningUser => {
                    if (e.target.dataset.transcriptid == addedOwningUser.transcriptId) {
                        addedOwningUser.username = e.target.value;
                        addedOwningUser.transcriptId = e.target.dataset.transcriptid;
                        isUsernameNew = false;
                    }
                });
                if (isUsernameNew) {
                    return [...prevAddedOwningUsers, {
                        username: e.target.value, transcriptId: e.target.dataset.transcriptid
                    }];
                } else {
                    return prevAddedOwningUsers;
                }
            }
        });
    }

    function handleAddOwningUserOnClick(e) {
        setAddedOwningUsers(prevAddedOwningUsers => {
            let transcriptToAdd, usernameToAdd;
            prevAddedOwningUsers.forEach(addedOwningUser => {
                if (addedOwningUser.transcriptId == e.target.dataset.transcriptid) {
                    transcriptToAdd = addedOwningUser.transcriptId;
                    usernameToAdd = addedOwningUser.username;
                    addedOwningUser.username = "";
                }
            });
            fetch(`/api/users`)
                .then(res => res.json())
                .then(users => {
                    users.forEach(user => {
                        if (user.username == usernameToAdd) {
                            fetch(`/api/transcripts/${transcriptToAdd}`)
                                .then(res => res.json())
                                .then(savedTranscript => {
                                    if (!savedTranscript.owningUsers.includes(usernameToAdd)) {
                                        let newTranscript = savedTranscript;
                                        newTranscript.owningUsers = [...newTranscript.owningUsers, usernameToAdd];
                                        fetch(`/api/transcripts/${transcriptToAdd}`, {
                                            method: 'PUT', body: JSON.stringify(newTranscript), headers: {
                                                'Accept': 'application/json', 'Content-Type': 'application/json'
                                            }
                                        }).then(res => {
                                            if (res.ok) {
                                                toast.success('Transcript shared!', {
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
                                        toast.error('ERROR: User is already owner', {
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
                    });
                }).catch(err => console.error(err));
            return prevAddedOwningUsers;
        });
    }

    function assignStarColor(index, transcriptRating) {
        if (transcriptRating == -1) {
            return "#a0a0a0";
        } else {
            return index + 1 <= (transcriptRating) ? "#ffc107" : "#e4e5e9";
        }
    }

    useEffect(() => {
        let transcriptsListBuilder = [];
        fetch('/api/transcripts')
            .then(res => res.json())
            .then(savedTranscripts => {
                let showedTranscripts = [];
                savedTranscripts.forEach(savedTranscript => {
                    if (savedTranscript.owningUsers.includes(String(username))) {
                        let transcriptRating = -1, sumTranscriptRating = 0, totalTranscriptRatings = 0;
                        savedTranscript.userRatings.forEach(userRating => {
                            sumTranscriptRating += userRating.rating;
                            totalTranscriptRatings++;
                        });
                        if (totalTranscriptRatings > 0) {
                            transcriptRating = Math.round(sumTranscriptRating / totalTranscriptRatings);
                        }
                        transcriptsListBuilder.push((<>
                            <Row className={"mt-xl-5"}>
                                <Col xs={3} className={"d-flex justify-content-center"}>
                                    <h4>{savedTranscript.singer}</h4>
                                </Col>
                                <Col xs={4} className={"d-flex justify-content-center"}>

                                    <h4 className={"songLink"} onClick={handleSongClicked}
                                        data-singer={savedTranscript.singer}
                                        data-title={savedTranscript.title}
                                        data-owningusers={savedTranscript.owningUsers}>{savedTranscript.title}</h4>
                                </Col>
                                <Col xs={2} className={"d-flex justify-content-center"}>
                                    {[...Array(5)].map((star, index) => {
                                        return (<FaStar
                                            className='star'
                                            size={25}
                                            color={assignStarColor(index, transcriptRating)}
                                        />);
                                    })}
                                </Col>
                                <Col xs={3} className={"d-flex justify-content-center"}>
                                    <input type={"text"}
                                           placeholder={"username"} data-transcriptid={savedTranscript._id}
                                           data-singer={savedTranscript.singer}
                                           onChange={handleAddOwningUserChange}/>
                                    <Button className={"btn btn-dark ms-xl-1"} onClick={handleAddOwningUserOnClick}
                                            data-transcriptid={savedTranscript._id}>Afegeix Editor</Button>
                                </Col>
                            </Row>
                            <hr/>
                        </>));
                        showedTranscripts.push(savedTranscript._id);
                    }
                    if (savedTranscript.savedByUsers.includes(String(username)) && !showedTranscripts.includes(savedTranscript._id)) {
                        let transcriptRating = -1, sumTranscriptRating = 0, totalTranscriptRatings = 0;
                        savedTranscript.userRatings.forEach(userRating => {
                            sumTranscriptRating += userRating.rating;
                            totalTranscriptRatings++;
                        });
                        if (totalTranscriptRatings > 0) {
                            transcriptRating = Math.round(sumTranscriptRating / totalTranscriptRatings);
                        }
                        transcriptsListBuilder.push((<>
                            <Row className={"mt-xl-5"}>
                                <Col xs={3} className={"d-flex justify-content-center"}>
                                    <h4>{savedTranscript.singer}</h4>
                                </Col>
                                <Col xs={4} className={"d-flex justify-content-center"}>

                                    <h4 className={"songLink"} onClick={handleSongClicked}
                                        data-singer={savedTranscript.singer}
                                        data-title={savedTranscript.title}
                                        data-owningusers={savedTranscript.owningUsers}>{savedTranscript.title}</h4>
                                </Col>
                                <Col xs={2} className={"d-flex justify-content-center"}>
                                    {[...Array(5)].map((star, index) => {
                                        return (<FaStar
                                            className='star'
                                            size={25}
                                            color={assignStarColor(index, transcriptRating)}
                                        />);
                                    })}
                                </Col>
                                <Col xs={3} className={"d-flex justify-content-center"}/>
                            </Row>
                            <hr/>
                        </>));
                    }
                });
            }).then(() => setTranscriptsList(transcriptsListBuilder)).catch(err => console.error(err));
    }, []);

    return <>
        <Container className={"align-items-center"}>
            <Row className={"mt-xl-5"}>
                <Col/>
                <Col xs={8} className={"d-flex justify-content-center"}>
                    <h1>COL·LECCIÓ DE TRANSCRIPCIONS</h1>
                </Col>
                <Col/>
            </Row>
            <Row className={"mt-xl-5"}>
                <Col xs={3} className={"d-flex justify-content-center"}>
                    <h2>ARTISTA</h2>
                </Col>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h2>TÍTOL DE LA CANÇÓ</h2>
                </Col>
                <Col xs={2} className={"d-flex justify-content-center"}>
                    <h2>VALORACIÓ</h2>
                </Col>
                <Col xs={3} className={"d-flex justify-content-center"}>
                    <h2>COMPARTIR</h2>
                </Col>
            </Row>
            {transcriptsList}
        </Container>
    </>
}