console.log("script running.");

const get = selector => document.querySelector(selector);
const passcode = get("#passcode");
const message = get("#message");
const submitBtn = get("#submitBtn");

const DB = firebase.database();

const LIMITS = {
    length: 5
}

submitBtn.addEventListener('click', () => {
    const [ pw, msg ] = [
        `${passcode.value}`.trim(),
        `${message.value}`.trim()
    ];

    try {
        if (pw.length < LIMITS.length)
            throw "Passcode too short.";

        if (!msg.length)
            throw "Message needs at least one non-space character."
    } catch (err) {
        return window.alert(err);
    }

    DB.ref(`/${pw}`).set(msg, err => {
        if (!err) {
            message.value = "";
            return window.alert("Message sent.");
        }

        window.alert("Failed to send message. Check console.")
        console.log(err);
    });
})