import React from 'react';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    return (
        <div className='courgette-font'>
            <h1>What is Storytree?</h1>
            <p>Storytree is a collaborative writing platform allowing for people to write stories together. Create the first chapter of a story and have others build off of it in future chapters. Then browse the creations built upon by other people. Want to see a different interpretation? Look at different paths and upvote your favorite ones. Don't like the direction of a story? Branch it off and write your own ending!</p>
            <div className="card-container">
                <div className="browse-card branch-card" aria-label="Background image" onClick={() => navigate('/browse')}>
                    <img src="/img/branch.png" alt="Branch" />
                    <h2>Branch:</h2>
                    <p>Click here to search for unfinished stories that you can finish. Maybe you'll take the story in a new unexpected direction.</p>
                </div>
                <div className="browse-card read-card" aria-label="Background image" onClick={() => navigate('/browse')}>
                    <img src="/img/read.png" alt="Read" />
                    <h2>Read:</h2>
                    <p>Click here to read other people's creations. Use tags to filter for stories you like and branch off your own outcome to that story.</p>
                </div>
                <div className="browse-card create-card" aria-label="Background image" onClick={() => navigate('/write')}>
                <img src="/img/create1.png" alt="Create" />
                    <h2>Create:</h2>
                    <p>Start here to create the first chapter of a world that you have imagined. Then publish it for others to take in their own direction.</p>
                </div>
            </div>
        </div>
    );
}

export default HomePage;
