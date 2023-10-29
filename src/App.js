import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
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

export const App = () => {
	const [token, setToken] = useState("");
	const [nowPlaying, setNowPlaying] = useState({});
	const [loggedIn, setLoggedIn] = useState(false);

	let songSet = new Set();

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

	function checkAnswer(answer) {
		if (nowPlaying.name.toLowerCase() === answer.toLowerCase()) {
			console.log("match");
			// currentSong = playNextSong(player, songSet);
		}
	}

	const handleKeyPress = (e) => {
		let keycode = e.keyCode ? e.keyCode : e.which;
		console.log(keycode);
		if (keycode === 13) {
			checkAnswer(document.getElementById("input").value);
			document.getElementById("input").value = "";
		}
	};

	function playNextSong(player, set) {
		const randomNum = Math.floor(Math.random() * 100) + 1;
		set.Add(player.getCurrentState().track_window.current_track);
		for (
			let i = 0;
			i < randomNum ||
			set.has(player.getCurrentState().track_window.current_track);
			i++
		) {
			player.NextTrack();
		}
		return player.getCurrentState().track_window.current_track;
	}

	const skip = () => {
		api.skipToNext().then(() => {
			getNowPlaying();
		});
	};

	const TextInput = () => {
		return (
			<>
				<h2>Lorem ipsum dolor sit amet</h2>
				<div className="search-box">
					<input
						type="text"
						onKeyDown={handleKeyPress}
						id="input"
						placeholder=""
					></input>
				</div>
			</>
		);
	};

	return (
		<div className="App">
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

					<Header />
					<TextInput />
				</>
			)}
		</div>
	);
};

const Header = () => {
	return <h1>Guess the song!</h1>;
};

export default App;
