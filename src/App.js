import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import { SoundPlayer } from "./SoundPlayer";
import Countdown from "react-countdown";

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

	const [timer, setTimer] = useState(12);

	const [score, setScore] = useState(0);
	const [total, setTotal] = useState(0);
	const [inputValue, setInputValue] = useState("");

	// const [songsPlayed, setSongsPlayed] = useState(0);
	const [playlistLength, setPlaylistLength] = useState(0);
	const [isCorrect, setIsCorrect] = useState(true);
	const [isShaking, setIsShaking] = useState(false);
	// useEffect(() => {
	// 	console.log(nowPlaying.name);
	// 	getNowPlaying();
	// }, [songsPlayed]);

	useEffect(() => {
		const token = getTokenFromURL().access_token;
		window.location.hash = "";

		if (token) {
			setToken(token);
			api.setAccessToken(token);
			setLoggedIn(true);
			getNowPlaying();
		}
	}, []);

	useEffect(() => {
		const timerId = setInterval(() => {
			if (timer > 0) {
				setTimer(timer - 1);
			} else {
				skip();
			}
		}, 1000);

		// Cleanup the timer when the component unmounts
		return () => clearInterval(timerId);
	}, [timer]);

	const Timer = ({ timer }) => {
		return (
			<div className="Timer">
				<span className="TimerNumber">{timer}</span>
				<span className="TimerLabel">seconds remaining</span>
			</div>
		);
	};

	const getNowPlaying = () => {
		api.getMyCurrentPlaybackState().then((response) => {
			setNowPlaying({
				name: response.item.name,
				albumArt: response.item.album.images[0].url,
			});
		});
	};

	const strip = (song) => {
		if (song.indexOf("(") !== -1) {
			song = song.substring(0, song.indexOf("(") - 1);
		} else if (song.indexOf("-") !== -1) {
			song = song.substring(0, song.indexOf("-") - 1);
		}
		return song;
	};

	function checkAnswer(answer) {
		let song = strip(nowPlaying.name);

		console.log(song.toLowerCase() === answer.toLowerCase());
		if (song.toLowerCase() === answer.toLowerCase()) {
			setIsCorrect(true);
			skip().then(() => {
				console.log("skipped");
			});
			setScore(score + 1);
			setTotal(total + 1);
		} else {
			setTotal(total + 1);
			setIsCorrect(false);
			setIsShaking(true);
			setTimeout(() => {
				setIsShaking(false);
			}, 500);
		}
	}

	const handleKeyPress = (e) => {
		let keycode = e.keyCode ? e.keyCode : e.which;
		console.log(keycode);
		console.log(nowPlaying.name);
		if (keycode === 13) {
			checkAnswer(e.target.value);
			setInputValue("");
		}
	};

	const skip = async () => {
		await api.skipToNext();
		await new Promise((resolve) => setTimeout(resolve, 300));
		setTimer(12);
		getNowPlaying();
	};

	const Accuracy = ({ score, total }) => {
		const accuracy = total === 0 ? 0 : ((score / total) * 100).toFixed(0);
		const accuracyColor = accuracy >= 30 && accuracy <= 70 ? 'white' : accuracy < 30 ? 'red' : 'green';
		console.log(total);
		console.log(score);
		return (
			<div className="Accuracy">
				<span className="AccuracyText">Accuracy</span>
				<span
					className="AccuracyNumber"
					style={{ color: accuracyColor }}
				>
					{accuracy}%
				</span>
			</div>
		);
	};

	return (
		<div className="App">
			{!loggedIn && (
				<>
					<h3>Welcome to Song Guesser!</h3>
					<h2>Please log in to Spotify:</h2>
					<a href="http://localhost:8888/login">Authenticate</a>
				</>
			)}
			{loggedIn && (
				<>
					{total > 0 && <Accuracy score={score} total={total} /> }
					<div>
						<img
							src={nowPlaying.albumArt}
							style={{ height: 300 }}
							alt="Blurred Image"
							class="blur-image"
						/>
					</div>
					<Header />
					<div className="search-box">
						<form
							autoComplete="off"
							onSubmit={(e) => e.preventDefault()}
						>
							<input
								className={
									isShaking || timer === 0
										? "shake"
										: "input-default"
								}
								type="text"
								onKeyDown={handleKeyPress}
								onChange={(e) => setInputValue(e.target.value)}
								id="input"
								value={
									timer === 0
										? strip(nowPlaying.name)
										: inputValue
								}
								style={{ textAlign: "center" }}
							></input>
						</form>
					</div>
					<Timer timer={timer} /> {}
				</>
			)}
		</div>
	);
};

const Header = () => {
	return <h1>Guess the song!</h1>;
};

export default App;
