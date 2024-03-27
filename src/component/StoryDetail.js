import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

const StoryDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [story, setStory] = useState(null);

    useEffect(() => {
        const fetchStoryDetail = async () => {
            const db = getDatabase();
            const storyRef = ref(db, `articles/${id}`); 
            onValue(storyRef, (snapshot) => {
                if (snapshot.exists()) {
                    const storyData = snapshot.val();
                    storyData.key = id;
                    setStory(storyData);
                } else {
                    console.log("No data available");
                    navigate(-1);
                }
            });
        };

        fetchStoryDetail();
    }, [id, navigate]);

    if (!story) {
        return <div>Loading...</div>;
    }
    return (
        <div className="story-detail">
            <h2>{story.title}</h2>
            <p>{story.synopsis}</p>
            <div className="views">Views: {story.views}</div>
            <div className="published">Published: {new Date(story.timestamp).toLocaleDateString()}</div>
            <div>Created By: {story.writtenby}</div>
            {story.branchedby && <div>Last Branched By: {story.branchedby}</div>}
            <p className="pre-line-text">{story.content}</p>
            <button className="branch-button" onClick={() => navigate('./branch')}>Branch</button>
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
        </div>
    );
};

export default StoryDetail;
