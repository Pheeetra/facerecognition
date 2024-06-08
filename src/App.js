import "./App.css";
import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Logo from "./components/Logo/Logo";
import Rank from "./components/Rank/Rank";
import ParticlesComponent from "./components/Particles/ParticlesComponent";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";

const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = "ff92663872c04b30809766db08c440e5";
  const USER_ID = "80ghhp2rkxx4";
  const APP_ID = "testing";
  const IMAGE_URL = imageUrl;

  const raw = JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });

  const requestOptions = {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: "Key " + PAT,
    },
    body: raw,
  };
  return requestOptions;
};

const extractBoundingBoxes = (regions, imageWidth, imageHeight) => {
  if (regions) {
    const boxes = regions.map((region) => {
      const boundingBox = region.region_info.bounding_box;
      return {
        leftCol: boundingBox.left_col * imageWidth,
        topRow: boundingBox.top_row * imageHeight,
        rightCol: imageWidth - boundingBox.right_col * imageWidth,
        bottomRow: imageHeight - boundingBox.bottom_row * imageHeight,
      };
    });
    console.log("Bounding boxes:", boxes); // Log the bounding box data
    return boxes;
  } else {
    console.log("No regions found in the response.");
    return [];
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      box: [],
      route: "signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        password: "",
        entries: 0,
        joined: "",
      },
    };
  }

  loadUser = (user) => {
    this.setState({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined,
      },
    });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input, box: [] }, () => {
      fetch(
        `https://api.clarifai.com/v2/models/face-detection/outputs`,
        returnClarifaiRequestOptions(this.state.input)
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to detect faces.");
          }
          return response.json();
        })
        .then((result) => {
          console.log("Clarifai response:", result); // Log the Clarifai API response
          const regions = result.outputs[0].data.regions;
          const image = document.getElementById("inputimage");

          if (image) {
            const handleImageLoad = () => {
              const imageWidth = image.width;
              const imageHeight = image.height;
              const boxes = extractBoundingBoxes(regions, imageWidth, imageHeight);
              console.log("Setting state with boxes:", boxes); // Log the boxes
              this.setState({ box: boxes });
              image.removeEventListener('load', handleImageLoad);
            };

            image.addEventListener('load', handleImageLoad);

            // For cases where the image might already be loaded:
            if (image.complete) {
              handleImageLoad();
            }
          }
        })
        .catch((error) => {
          console.log("Error detecting faces:", error);
        });

      fetch("http://localhost:3000/image", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: this.state.user.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data); // Log the response
          if (data && data.entries) {
            this.setState((prevState) => ({
              user: {
                ...prevState.user,
                entries: Number(data.entries),
              },
            }));
          } else {
            console.error("Unexpected response format:", data);
          }
        })
        .catch((err) => console.log("Error updating entries:", err));
    });
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({
        isSignedIn: false,
        user: { id: "", name: "", email: "", entries: 0, joined: "" },
      });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { imageUrl, box, isSignedIn, route } = this.state;
    return (
      <div className="App">
        <ParticlesComponent id="particles-js" />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        {route === "home" ? (
          <div>
            <Logo />
            <Rank user={this.state.user} />
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition imageUrl={imageUrl} box={box} />
          </div>
        ) : route === "signin" ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
