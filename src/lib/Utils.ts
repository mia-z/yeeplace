export const randomColor = () => Math.floor(Math.random()*16777215).toString(16);

export const sha256Hash = async (input: string): Promise<string> => {
    const textAsBuffer = new TextEncoder().encode(input);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", textAsBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray
        .map((item) => item.toString(16).padStart(2, "0"))
        .join("");
    return hash;
}

export const fetchDggToken = async (code: string) => {
    const res = await fetch(`https://www.destiny.gg/oauth/token?grant_type=authorization_code&code=${code}&client_id=8fhF1ImykNycsQHjpRV91NhwtXMHIddK&redirect_uri=http://localhost:5173/dgglogin&code_verifier=C4E0blXCs8SiBpAtYiJRULmFUBaaQ7rV3v24b3R01oEvbLIP19`);

    console.log(res);
}