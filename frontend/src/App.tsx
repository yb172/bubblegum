import React, { useState } from "react";
import "./App.css";
import { Gum, gumElementId } from "./Gum";
import organicLogo from "./organic.gif";
import trashIcon from "./trash.png";
import * as htmlToImage from "html-to-image";

const wrapViewId = "wrap";
const gumViewId = "gum";
const trashViewId = "trash";

const download = () => {
  const element = document.getElementById(gumElementId);
  if (!element) {
    return;
  }
  htmlToImage
    .toJpeg(element, { quality: 0.95, backgroundColor: "#FFB6C1" })
    .then(function (dataUrl) {
      var link = document.createElement("a");
      link.download = "used-bubblegum.jpg";
      link.href = dataUrl;
      link.click();
    });
};

const App = () => {
  const [view, setView] = useState<string>(wrapViewId);
  const [showDoneBtn, setShowDoneBtn] = useState<boolean>(false);

  const unwrap = () => {
    setView(gumViewId);
    setTimeout(() => {
      setShowDoneBtn(true);
    }, 5000);
  };

  const done = () => {
    const btn = document.getElementById("DoneBtn");
    if (!btn) return;
    btn.classList.add("disabled");
    btn.setAttribute("disabled", "true");

    download();
    setTimeout(() => {
      setView(trashViewId);
    }, 1000);
  };

  const wrapView = (
    <div className="wrap">
      <p className="ribbon-upper-text">The all-digital</p>
      <div className="ribbon">Bubblegum</div>
      <p className="ribbon-lower-text">chewable treat</p>
      <p className="organic-label">
        <img
          src={organicLogo}
          className="organic-logo"
          width="25px"
          height="25px"
        />
        &nbsp; 100% digital organic, No NFT included
      </p>
      <p className="product-info-label">
        RISD 2022_CE_FA Graphic Design: Introduction 040
        <br />
        Serving size: 1 webpage (~500kb). Contains: Typescript, C++ developers
        are advised to take the product with caution. This product is
        manufactured on a machine that creates other products which may include
        code written in Go, Java, or Python.
      </p>
      <p>
        <button className="btn" id="UnwrapBtn" onClick={unwrap}>
          Unwrap
        </button>
      </p>
    </div>
  );

  const trashView = (
    <div className="wrap">
      <p>Please throw used gum into trash can</p>
      <img className="trash-icon" src={trashIcon} width="200px" />
      <h1>Thank you!</h1>
    </div>
  );

  if (view === wrapViewId) {
    return wrapView;
  } else if (view == trashViewId) {
    return trashView;
  }
  return (
    <div>
      <Gum />
      <div className="done-panel">
        <p>
          Tap on pink to chew, long tap to bubble&nbsp;
          {showDoneBtn && (
            <button className="btn" id="DoneBtn" onClick={done}>
              I'm done
            </button>
          )}
        </p>
      </div>
    </div>
  );
};

export default App;
