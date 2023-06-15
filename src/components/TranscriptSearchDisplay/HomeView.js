import React, {useEffect, useState} from "react";
import {Col, Row} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import "../../css/TranscriptSearchDisplayElements.css"
import {FaStar} from "react-icons/fa";

export function HomeView(props) {
    const [transcriptsList, setTranscriptsList] = useState([]);

    function handleSongClicked(e) {
        props.onClick(e.target.dataset.singer, e.target.dataset.title, e.target.dataset.owningusers);
    }

    function assignStarColor(index, transcriptRating) {
        if (transcriptRating == -1) {
            return "#a0a0a0";
        } else {
            return index + 1 <= (transcriptRating) ? "#ffc107" : "#e4e5e9";
        }
    }

    useEffect(() => {
        let transcriptsListBuilder = [], searchInput = props.searchInput;

        if (searchInput != "") {
            fetch('/api/transcripts')
                .then(res => res.json())
                .then(savedTranscripts => {

                    savedTranscripts.sort(function (transcriptA, transcriptB) {
                        let transcriptRatingA = -1, sumTranscriptRatingA = 0, totalTranscriptRatingsA = 0;
                        transcriptA.userRatings.forEach(userRating => {
                            sumTranscriptRatingA += userRating.rating;
                            totalTranscriptRatingsA++;
                        });
                        if (totalTranscriptRatingsA > 0) {
                            transcriptRatingA = Math.round(sumTranscriptRatingA / totalTranscriptRatingsA);
                        }

                        let transcriptRatingB = -1, sumTranscriptRatingB = 0, totalTranscriptRatingsB = 0;
                        transcriptB.userRatings.forEach(userRating => {
                            sumTranscriptRatingB += userRating.rating;
                            totalTranscriptRatingsB++;
                        });
                        if (totalTranscriptRatingsB > 0) {
                            transcriptRatingB = Math.round(sumTranscriptRatingB / totalTranscriptRatingsB);
                        }

                        return transcriptRatingB - transcriptRatingA;
                    });

                    savedTranscripts.forEach(savedTranscript => {
                        if (savedTranscript.isPublished && (savedTranscript.singer.toUpperCase().includes(searchInput.toUpperCase()) || savedTranscript.title.toUpperCase().includes(searchInput.toUpperCase()))) {
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
                                    <Col xs={4} className={"d-flex justify-content-center"}>
                                        <h4>{savedTranscript.singer}</h4>
                                    </Col>
                                    <Col xs={4} className={"d-flex justify-content-center"}>

                                        <h4 className={"songLink"}
                                            onClick={handleSongClicked}
                                            data-singer={savedTranscript.singer}
                                            data-title={savedTranscript.title}
                                            data-owningusers={savedTranscript.owningUsers}>{savedTranscript.title}</h4>
                                    </Col>
                                    <Col xs={4} className={"d-flex justify-content-center"}>
                                        {[...Array(5)].map((star, index) => {
                                            return (<FaStar
                                                className='star'
                                                size={25}
                                                color={assignStarColor(index, transcriptRating)}
                                            />);
                                        })}
                                    </Col>
                                </Row>
                                <hr/>
                            </>));
                        }
                    });
                }).then(() => setTranscriptsList(transcriptsListBuilder)).catch(err => console.error(err));
        } else {
            fetch('/api/transcripts')
                .then(res => res.json())
                .then(savedTranscripts => {

                    savedTranscripts.sort(function (transcriptA, transcriptB) {
                        let transcriptRatingA = -1, sumTranscriptRatingA = 0, totalTranscriptRatingsA = 0;
                        transcriptA.userRatings.forEach(userRating => {
                            sumTranscriptRatingA += userRating.rating;
                            totalTranscriptRatingsA++;
                        });
                        if (totalTranscriptRatingsA > 0) {
                            transcriptRatingA = Math.round(sumTranscriptRatingA / totalTranscriptRatingsA);
                        }

                        let transcriptRatingB = -1, sumTranscriptRatingB = 0, totalTranscriptRatingsB = 0;
                        transcriptB.userRatings.forEach(userRating => {
                            sumTranscriptRatingB += userRating.rating;
                            totalTranscriptRatingsB++;
                        });
                        if (totalTranscriptRatingsB > 0) {
                            transcriptRatingB = Math.round(sumTranscriptRatingB / totalTranscriptRatingsB);
                        }

                        return transcriptRatingB - transcriptRatingA;
                    });

                    savedTranscripts.forEach(savedTranscript => {
                        if (savedTranscript.isPublished) {
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
                                    <Col xs={4} className={"d-flex justify-content-center"}>
                                        <h4>{savedTranscript.singer}</h4>
                                    </Col>
                                    <Col xs={4} className={"d-flex justify-content-center"}>

                                        <h4 className={"songLink"} onClick={handleSongClicked}
                                            data-singer={savedTranscript.singer}
                                            data-title={savedTranscript.title}
                                            data-owningusers={savedTranscript.owningUsers}>{savedTranscript.title}</h4>
                                    </Col>
                                    <Col xs={4} className={"d-flex justify-content-center "}>
                                        {[...Array(5)].map((star, index) => {
                                            return (<FaStar
                                                className='star'
                                                size={25}
                                                color={assignStarColor(index, transcriptRating)}
                                            />);
                                        })}
                                    </Col>
                                </Row>
                                <hr/>
                            </>));
                        }
                    });
                }).then(() => setTranscriptsList(transcriptsListBuilder)).catch(err => console.error(err));
        }
    }, [props.fetchSwitcher]);

    return <>
        <Container className={"align-items-center"}>
            <Row className={"mt-xl-5"}>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h2>ARTISTA</h2>
                </Col>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h2>TÍTOL DE LA CANÇÓ</h2>
                </Col>
                <Col xs={4} className={"d-flex justify-content-center"}>
                    <h2>VALORACIÓ</h2>
                </Col>
            </Row>
            {transcriptsList}
        </Container>
    </>
}