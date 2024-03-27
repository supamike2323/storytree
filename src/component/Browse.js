import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, update } from 'firebase/database';
import Fuse from 'fuse.js';
const MAX_CHARACTERS = 150;
const MAX_TITLE = 75;

export default function Browse({ stories }) {
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        let processedStories = [...stories];

        if (searchTerm) {
            const fuse = new Fuse(stories, {
                keys: ['title', 'author.firstName', 'content', 'synopsis'],
                includeScore: true
            });
            processedStories = fuse.search(searchTerm).map(result => result.item);
        }

        switch (filter) {
            case 'views':
                processedStories.sort((a, b) => b.views - a.views);
                break;
            case 'recent':
                processedStories.sort((a, b) => b.timestamp - a.timestamp);
                break;
            default:
                break;
        }

        setFilteredData(processedStories);
        setIsLoading(false);
    }, [searchTerm, stories, filter]);

    const redirectToStory = (story) => {
        const db = getDatabase();
        const storyRef = ref(db, `articles/${story.key}`);
        update(storyRef, {
            views: story.views + 1,
        }).then(() => {
            console.log("Story viewcount updated successfully");
        }).catch((error) => {
            console.error("Error updating story viewcount: ", error);
        });

        navigate(`/story/${story.key}`);
    };

    const branchStory = (key) => {
        navigate(`/story/${key}/branch`);
    };

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit'
        });
    };

    const storyCards = filteredData.map((d) => (
        <div key={d.key} className="browse-card">
            <div className="card-content Merriweather-font">
                <h3>{d.title.length > MAX_TITLE ? d.title.substring(0, MAX_TITLE) + '...' : d.title}</h3>
                <p>{d.synopsis.length > MAX_CHARACTERS ? d.synopsis.substring(0, MAX_CHARACTERS) + '...' : d.synopsis}</p>
                <div className="timestamp">{formatTimestamp(d.timestamp)}</div>
                <button className="branch-button" onClick={() => branchStory(d.key)}>Branch</button>
                <button className="branch-button" onClick={() => redirectToStory(d)}>Read</button>
            </div>
            <div className="view-count">Views: {d.views}</div>
        </div>
    ));


    return (
        <div>
            <section className='available-stories courgette-font'>
                <h1>Available Stories</h1>
            </section>
            <section className='filter-search-container'>
                <div className='search-bar'>
                    <input
                        type="text"
                        className='search-input'
                        placeholder="Search stories..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className='filter-buttons'>
                    <button className="browse courgette-font large-button" onClick={() => setFilter('views')}>Most Viewed</button>
                    <button className="browse courgette-font large-button" onClick={() => setFilter('recent')}>Recent</button>
                </div>
            </section>
            <div className='story-cards-container'>
                {isLoading ? <p>Loading stories...</p> : storyCards.length > 0 ? storyCards : <p>No stories found.</p>}
            </div>
        </div>
    );
}