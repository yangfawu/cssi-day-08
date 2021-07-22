console.log("script running");

const get = selector => document.querySelector(selector);
const input = get("#passcode");
const container = get("#messageContainer");

const PASSCODE_LIMITS = {
    length: 5,
    regex: /(\.|\$|\#|\[|\]|\/)/g
}

const CARDS = [];
const makeCard = passcode => {
    const node = document.createElement('div');
    node.classList.add("my-card");
    node.innerHTML = `
        <h1>
            <span>Message from</span>
            <code>${passcode}</code>
        </h1>
    `;

    const msg = document.createElement("p");
    node.appendChild(msg);

    return {
        passcode,
        node,
        updateMessage(text) {
            msg.innerText = text;
        }
    }
}

const getMessages = () => {
    const passcode = `${input.value}`.trim();
    try {
        if (passcode.length < PASSCODE_LIMITS.length)
            throw "Passcode is too short.";

        if (PASSCODE_LIMITS.regex.test(passcode))
            throw "Passcode cannot contain ., $, #, [, ], /.";
    } catch (error) {
        return window.alert(error);
    }

    let appended = false;
    let card = CARDS.find(cand => cand.passcode == passcode);
    if (card)
        appended = true;
    else
        card = makeCard(passcode);
    
    const ref = firebase.database().ref(`/${passcode}`);
    ref.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data === null || data === undefined) {
            ref.off();
            return window.alert("There is no message linked to passcode.");
        }

        console.log({ passcode, data });

        if (!appended) {
            container.appendChild(card.node);
            appended = true;
        }
        
        card.updateMessage(data);
    });
}

