import "./App.css";
import { useContext, useEffect, useState } from "react";
import { keyboard } from "@testing-library/user-event/dist/keyboard";
import { Component } from "react";
// import { api } from "./App";

export class SoundPlayer extends Component {
	render() {
		// const [nowPlaying, setNowPlaying] = useState({});

		// const api = this.props;

		// const getNowPlaying = (api) => {
		// 	api.getMyCurrentPlaybackState().then((response) => {
		// 		setNowPlaying({
		// 			name: response.item.name,
		// 			albumArt: response.item.album.images[0].url,
		// 		});
		// 	});
		// };

		// const skip = () => {
		// 	api.skipToNext().then(() => {
		// 		getNowPlaying();
		// 	});
		// };

		// useEffect(() => {
		// 	getNowPlaying(api);
		// }, []);

		return (
			<>
				<Header />
				{/* <p>{api}</p> */}
				<TextInput />
			</>
		);
	}
}

let songSet = new Set();

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

// function checkAnswer(answer) {
// 	if (currentSong.toLowerCase() === answer.toLowerCase()) {
// 		currentSong = playNextSong(player, songSet);
// 	}
// }

const Header = () => {
	return <h1>Guess the song!</h1>;
};

// const handleKeyPress = (e) => {
// 	let keycode = e.keyCode ? e.keyCode : e.which;
// 	console.log(keycode);
// 	if (keycode === 13) {
// 		checkAnswer(document.getElementById("input").value);
// 		document.getElementById("input").value = "";
// 	}
// };

const TextInput = () => {
	return (
		<>
			<h2>Lorem ipsum dolor sit amet</h2>
			<div className="search-box">
				{/* <input
					type="text"
					onKeyDown={handleKeyPress}
					id="input"
					placeholder=""
				></input> */}
				<text>Test</text>
			</div>
		</>
	);
};

export default { SoundPlayer };
