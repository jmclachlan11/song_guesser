import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { Routes, Route, Link } from "react-router-dom";
import { SoundPlayer } from "./SoundPlayer";

const api = new SpotifyWebApi();

const getTokenFromURL = () => {
	return window.location.hash
		.substring(1)
		.split("&")
		.reduce((initial, item) => {
			let parts = item.split("=");
			initial[parts[0]] = decodeURIComponent(parts[1]);
			return initial;
		}, {});
};

function App() {
	const [token, setToken] = useState("");
	const [nowPlaying, setNowPlaying] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		const token = getTokenFromURL().access_token;
		window.location.hash = "";

		if (token) {
			setToken(token);
			api.setAccessToken(token);
			setLoggedIn(true);
		}
	});

	const getNowPlaying = () => {
		api.getMyCurrentPlaybackState().then((response) => {
			setNowPlaying({
				name: response.item.name,
				albumArt: response.item.album.images[0].url,
			});
		});
	};

	const skip = () => {
		api.skipToNext().then(() => {
			getNowPlaying();
		});
	};

	return (
		<div className="App">
      <Routes>
        {/* <Route path="*" element={<App />} /> */}
        <Route path="sound-player" element={<SoundPlayer />} />
      </Routes>

			{!loggedIn && <a href="http://localhost:8888">Log in</a>}
			{loggedIn && (
				<>
					<div>Now Playing: {nowPlaying.name}</div>
					<div>
						<img
							src={nowPlaying.albumArt}
							style={{ height: 150 }}
						/>
					</div>
					<button onClick={getNowPlaying}>Check now playing</button>
					<button onClick={skip}>Skip</button>
          <Link to="sound-player">sound player</Link>
				</>
			)}
		</div>
	);
}

export default App ;
