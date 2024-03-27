import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, update } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const BranchStory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [story, setStory] = useState(null);
    const [typedValue, setTypedValue] = useState("default value");
    const [isModified, setIsModified] = useState(false);
    const textareaRef = useRef(null);
    const [userId, setUserId] = useState(null);
    const [isUserSignedIn, setIsUserSignedIn] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, user => {
            if (user) {
                setIsUserSignedIn(true);
                setUserId(user.uid);
            } else {
                navigate('/login');
            }
        });
    }, [navigate]);

    useEffect(() => {
        const fetchStoryDetail = async () => {
            const db = getDatabase();
            const storyRef = ref(db, `articles/${id}`);
            console.log(storyRef);
            onValue(storyRef, (snapshot) => {
                if (snapshot.exists()) {
                    const storyData = snapshot.val();
                    storyData.key = id;
                    setStory(storyData);
                    setTypedValue(storyData.content);;
                } else {
                    console.log("No data available");
                    navigate(-1);
                }
                console.log("onValue block is run");
            });
        };

        fetchStoryDetail();
    }, [id, navigate]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [typedValue]);

    const handleChange = (event) => {
        const inputtedValue = event.target.value;
        setTypedValue(inputtedValue);
        console.log(inputtedValue);
        setIsModified(true)
    };


    const handleSaveStory = () => {
        if (!isModified) {
            alert("No changes made to save.");
            return;
        }

        const db = getDatabase();
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
            const userRef = ref(db, `users/${currentUser.uid}`);
            onValue(userRef, (snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const branchedByUsername = userData.username;
                    const storyRef = ref(db, `articles/${id}`);
                    const updatePayload = {
                        content: typedValue,
                        timestamp: Date.now(),
                        branchedby: branchedByUsername,
                    };

                    update(storyRef, updatePayload).then(() => {
                        alert("Story branched successfully.");
                        navigate(`/story/${id}`);
                    }).catch((error) => {
                        console.error("Error branching story:", error);
                    });
                }
            }, {
                onlyOnce: true
            });
        }
    };

    if (!story) {
        return <div>Loading...</div>;
    }

    return (
        <div className="branch-detail courgette-font">
            <h2>Branch This Story</h2>
            <h3>Cick on the Story Detail box for editing, after you are done, simply click save story</h3>

            <form>
                <div className="branch-detail">
                    <h2>{story.title}</h2>
                    <p>{story.synopsis}</p>
                    <div className="views">Views: {story.views}</div>
                    <div className="published">Published: {new Date(story.timestamp).toLocaleDateString()}</div>
                    <div>Created By: {story.writtenby}</div>
                    {story.branchedby && <div>Last Branched By: {story.branchedby}</div>}
                </div>
                <h3>Story Details:</h3>
                <textarea
                    className="textbox branch-detail"
                    id="storyContent"
                    name="content"
                    placeholder="Start typing your story here..."
                    onChange={handleChange}
                    value={typedValue}
                    ref={textareaRef}
                >
                </textarea>

                <div className="button-container">
                    <button type="button" className="left-button btn btn-warning btn-rounded courgette-font" data-mdb-ripple-init onClick={handleSaveStory}>Save
                        Story</button>
                </div>
            </form>
        </div>

    );
};

export default BranchStory;
