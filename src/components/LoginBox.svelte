<script lang="ts">
    import { Circle } from "svelte-loading-spinners";
    import YEE from "../assets/YEE.png";
    import PEPE from "../assets/PEPE.png";

    export let initBoard;

    export let open = false;

    let selectedTeam: "YEE" | "PEPE" | null = null; 

    let loginKey: string = "";

    let noTeamSet: boolean = false;

    let loadingAccount: boolean = false;

    const onAnonymousSave = () => {
        localStorage.setItem("user", JSON.stringify({ user: "anon", team: selectedTeam }));
        open = false;
        initBoard();
    }

    const onLoginTokenSave = async () => {
        noTeamSet = false;
        loadingAccount = true;
        console.log(loginKey);
        const res = await fetch("https://localhost:4001/dggloginproxy?token=" + loginKey);
        const user = await res.json() as DggUser;
        
        if (!user.team) {
            noTeamSet = true;
            loadingAccount = false;
            return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        open = false;
        initBoard();
    }
</script>

<div class={`absolute flex flex-col top-0 left-0 w-[100vw] h-[100vh] bg-[rgba(20,20,20,0.7)] ${open ? "" : "hidden"}`}>
    <div class={"relative w-1/4 p-3 flex flex-col m-auto rounded-md bg-[whitesmoke]"}>
        {#if loadingAccount}
            <div class={`absolute flex flex-col top-0 left-0 w-full h-full rounded-md z-50 backdrop-blur-sm opacity-100`}>
                <div class={"flex flex-col m-auto"}>
                    <div class={"mx-auto"}>
                        <Circle color={"#1111ff"} />
                    </div>
                    <div class={"mt-3 select-none roboto font-bold"}>
                        Fetching account..
                    </div>
                </div>
            </div>
        {/if}
        <div class={"roboto mb-3 text-center text-xl text-black"}>
            Link DGG Account
        </div>
        <a href={"https://www.destiny.gg/profile/developer"} target={"_blank"} rel={"noreferrer"} class={"bg-blue-500 hover:bg-blue-400 active:bg-blue-500 transition-all shadow-md cursor-pointer p-2 mx-auto w-fit text-white roboto text-center rounded-md"}>
            Fetch login key
        </a>
        <div class={"roboto mb-3 w-4/5 mx-auto text-center text-xs text-black"}>
            Click the button above to go to the Destiny.gg developer page where you can fetch a login key - or create a new one under the "connections" tab.
        </div>
        <input class={"transition-all focus:border-blue-400 outline-none w-4/5 mx-auto border-[1px] border-[#dedede] rounded-md h-10 px-2 text-center"} placeholder={"Paste login-key here"} bind:value={loginKey} />
        {#if noTeamSet}
            <div class={"roboto mb-3 w-4/5 mx-auto text-center text-xs text-red-500"}>
                You must select a team on the destiny.gg website. <a class={"text-blue-400"} href={"https://www.destiny.gg/profile"} target={"_blank"} rel={"noreferrer"}>Select one here</a> under the "PEPE vs YEE" section and try again.
            </div>
        {/if}
        <button disabled={loginKey === ""} on:click={onLoginTokenSave} on:keydown={onLoginTokenSave} class={"bg-blue-500 enabled:hover:bg-blue-400 enabled:active:bg-blue-500 transition-all shadow-md cursor-pointer mt-3 p-2 mx-auto w-fit text-white roboto text-center rounded-md disabled:cursor-default disabled:opacity-50"}>
            Save
        </button>
        <hr class={"border-[#afafaf] my-3"} />
        <div class={"roboto mb-3 text-center text-xl text-black"}>
            Use anonymously
        </div>
        <div class={"flex flex-row justify-center space-x-5"}>
            <div on:click={() => selectedTeam = "YEE"} on:keydown={() => selectedTeam = "YEE"} class={`border-2 border-black rounded-md p-1 ${selectedTeam === "YEE" ? "bg-blue-500" : "bg-white"} hover:bg-blue-400 active:bg-blue-500 cursor-pointer`}>
                <img src={YEE} alt={"PEPE"} />
            </div>
            <div on:click={() => selectedTeam = "PEPE"} on:keydown={() => selectedTeam = "PEPE"} class={`border-2 border-black rounded-md p-1 ${selectedTeam === "PEPE" ? "bg-blue-500" : "bg-white"} hover:bg-blue-400 active:bg-blue-500 cursor-pointer`}>
                <img src={PEPE} alt={"PEPE"} />
            </div>
        </div>
        {#if selectedTeam === null}
            <div class={"roboto text-center text-black"}>
                Select team
            </div>
        {/if}
        <button disabled={selectedTeam === null} on:click={onAnonymousSave} on:keydown={onAnonymousSave} class={"bg-blue-500 enabled:hover:bg-blue-400 enabled:active:bg-blue-500 transition-all shadow-md cursor-pointer mt-3 p-2 mx-auto w-fit text-white roboto text-center rounded-md disabled:cursor-default disabled:opacity-50"}>
            Save
        </button>
    </div>
</div>