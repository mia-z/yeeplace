<script lang="ts">
    import { onMount } from "svelte";
    import LoginBox from "./components/LoginBox.svelte";
	import state from "./lib/PlaceService";
	import socket from "./lib/SignalRService";

	onMount(async () => {
		let user = localStorage.getItem("user");
		if (!user) {
			loggingIn = true;
			return;
		}
		const parsedUser = JSON.parse(user) as DggUser;
		state.setUser(parsedUser);
		await initBoard();
	});

	const initBoard = async () => {
		let user = localStorage.getItem("user");
		const parsedUser = JSON.parse(user) as DggUser;
		state.setUser(parsedUser);
		await state.build();
		socket.buildConnection();
		await socket.startConnection();
	}

	let loggingIn = false;
</script>

<main class={"m-0 p-0"} id={"main"}>

</main>

<LoginBox open={loggingIn} initBoard={initBoard} />