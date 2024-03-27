import React from 'react';

function WriteStory() {
  return (
    <div style={{ backgroundColor: 'beige' }}>

      <div className="container courgette-font">
        <h2>Write Your Story</h2>

        <form action="/submit-story" method="POST">
          <div className="mb-3">
            <input type="text" className="form-control" id="storyTitle" name="title"
              placeholder="Enter the title of your story here..." />
          </div>

          <div className="mb-3">
            <textarea className="textbox" id="storyContent" name="content" rows="10"
              placeholder="Start typing your story here..."></textarea>
          </div>

          <div className="button-container">
            <button type="button" className="left-button btn btn-warning btn-rounded courgette-font" data-mdb-ripple-init>Save
              Story</button>
            <button type="button" className="right-button btn btn-warning btn-rounded courgette-font" data-mdb-ripple-init>Publish
              Story</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WriteStory;
