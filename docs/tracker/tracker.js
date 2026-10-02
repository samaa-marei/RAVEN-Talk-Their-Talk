```javascript
/* Raven Training Tracker
   - Branded welcome screen
   - First + Last Name
   - Sends START to Google Apps Script
   - Sends CLOSE when learner leaves
   - Uses R2.png from the docs folder
   - Course: Talk Their Talk
*/

(function () {
  "use strict";

  const cfg = window.RISE_TRACKER_CONFIG || {};
  const ENDPOINT = cfg.endpoint || "";

  let started = false;
  let closed = false;
  let learnerName = "";
  let sessionId = "";

  /* -----------------------------------------
     SEND DATA TO GOOGLE APPS SCRIPT
  ----------------------------------------- */

  function send(action) {
    if (!ENDPOINT || !learnerName || !sessionId) {
      return;
    }

    const url =
      ENDPOINT +
      "?action=" +
      encodeURIComponent(action) +
      "&name=" +
      encodeURIComponent(learnerName) +
      "&sessionId=" +
      encodeURIComponent(sessionId);

    const img = new Image();

    img.src = url;
  }

  /* -----------------------------------------
     CLOSE SESSION
  ----------------------------------------- */

  function closeSession() {
    if (!started || closed || !learnerName) {
      return;
    }

    closed = true;

    send("close");
  }

  /* -----------------------------------------
     CREATE WELCOME SCREEN
  ----------------------------------------- */

  function createWelcomeScreen() {

    const style = document.createElement("style");

    style.textContent = `

      #raven-tracker-overlay {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.68);
        padding: 24px;
        box-sizing: border-box;
        font-family:
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Roboto,
          Arial,
          sans-serif;
      }

      #raven-tracker-card {
        width: min(92vw, 620px);
        background: #ffffff;
        border-radius: 18px;
        padding: 44px 54px 40px;
        box-sizing: border-box;
        box-shadow:
          0 30px 80px rgba(0, 0, 0, 0.35),
          0 8px 25px rgba(0, 0, 0, 0.18);
        text-align: left;
        animation: ravenTrackerIn 0.28s ease-out;
      }

      @keyframes ravenTrackerIn {
        from {
          opacity: 0;
          transform: translateY(15px) scale(0.98);
        }

        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }

      #raven-tracker-brand {
        text-align: center;
        margin-bottom: 20px;
      }

      #raven-tracker-logo {
        display: block;
        width: 110px;
        max-width: 45%;
        max-height: 80px;
        object-fit: contain;
        margin: 0 auto 14px;
      }

      #raven-tracker-brand-name {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 3px;
        text-transform: uppercase;
        color: #777777;
      }

      #raven-tracker-title {
        margin: 0;
        text-align: center;
        font-size: 30px;
        line-height: 1.2;
        font-weight: 700;
        color: #111111;
      }

      #raven-tracker-subtitle {
        margin: 12px auto 32px;
        max-width: 460px;
        text-align: center;
        font-size: 16px;
        line-height: 1.55;
        color: #666666;
      }

      .raven-field {
        margin-bottom: 20px;
      }

      .raven-field label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 600;
        color: #222222;
      }

      .raven-field input {
        width: 100%;
        height: 54px;
        padding: 0 16px;
        box-sizing: border-box;
        border: 1px solid #d7d7d7;
        border-radius: 10px;
        background: #ffffff;
        color: #111111;
        font-size: 16px;
        outline: none;
        transition:
          border-color .18s ease,
          box-shadow .18s ease;
      }

      .raven-field input::placeholder {
        color: #999999;
      }

      .raven-field input:focus {
        border-color: #111111;
        box-shadow:
          0 0 0 3px rgba(201, 164, 92, 0.20);
      }

      #raven-tracker-error {
        min-height: 20px;
        margin: -4px 0 12px;
        color: #a00000;
        font-size: 13px;
        text-align: center;
      }

      #raven-tracker-start {
        width: 100%;
        height: 56px;
        margin-top: 4px;
        border: 0;
        border-radius: 10px;
        background: #111111;
        color: #ffffff;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
        transition:
          transform .15s ease,
          background .15s ease,
          box-shadow .15s ease;
        box-shadow:
          0 6px 18px rgba(0,0,0,.16);
      }

      #raven-tracker-start:hover {
        background: #252525;
        transform: translateY(-1px);
        box-shadow:
          0 9px 24px rgba(0,0,0,.20);
      }

      #raven-tracker-start:active {
        transform: translateY(0);
      }

      #raven-tracker-footer {
        margin-top: 22px;
        text-align: center;
        font-size: 12px;
        color: #999999;
      }

      @media (max-width: 600px) {

        #raven-tracker-overlay {
          padding: 15px;
        }

        #raven-tracker-card {
          width: 100%;
          padding: 32px 25px 28px;
          border-radius: 15px;
        }

        #raven-tracker-logo {
          width: 90px;
          max-height: 65px;
        }

        #raven-tracker-title {
          font-size: 25px;
        }

        #raven-tracker-subtitle {
          font-size: 15px;
          margin-bottom: 26px;
        }

      }

    `;

    document.head.appendChild(style);

    /* ---------- WELCOME SCREEN ---------- */

    const overlay = document.createElement("div");

    overlay.id = "raven-tracker-overlay";

    overlay.innerHTML = `

      <div id="raven-tracker-card">

        <div id="raven-tracker-brand">

          <img
            id="raven-tracker-logo"
            src="./R2.png"
            alt="Raven"
          >

          <div id="raven-tracker-brand-name">
            RAVEN L&D
          </div>

        </div>

        <h1 id="raven-tracker-title">
          Welcome to Talk Their Talk
        </h1>

        <p id="raven-tracker-subtitle">
          Please enter your name before starting the course.
          Your information is used to record your learning session.
        </p>

        <div class="raven-field">

          <label for="raven-first-name">
            First Name
          </label>

          <input
            id="raven-first-name"
            type="text"
            autocomplete="given-name"
            placeholder="First Name"
          >

        </div>

        <div class="raven-field">

          <label for="raven-last-name">
            Last Name
          </label>

          <input
            id="raven-last-name"
            type="text"
            autocomplete="family-name"
            placeholder="Last Name"
          >

        </div>

        <div id="raven-tracker-error"></div>

        <button id="raven-tracker-start">
          Start Talk Their Talk
        </button>

        <div id="raven-tracker-footer">
          Talk Their Talk
        </div>

      </div>

    `;

    document.body.appendChild(overlay);

    /* ---------- ELEMENTS ---------- */

    const firstName =
      document.getElementById("raven-first-name");

    const lastName =
      document.getElementById("raven-last-name");
```
