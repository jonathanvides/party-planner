const COHORT = "2401-FTB-MT-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    parties: [],
};

const partyList = document.querySelector("#parties");

const addPartyForm = document.querySelector("#addParty");
addPartyForm.addEventListener("submit", addParty);

async function render() {
    await getParties();
    renderParties();
}
render();

async function getParties() {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.parties = json.data;
    } catch (error) {
        console.error(error);
    }
}

async function deleteParty(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Party could not be deleted.');
        }

        render();
    } catch (error) {
        console.log(error);
    }
}

function renderParties() {
    if (!state.parties.length) {
        partyList.innerHTML = "<li>No parties.</li>";
        return;
    }

    const partyCards = state.parties.map((party) => {
        const li = document.createElement("li");
        const partyCard = document.createElement('li');
        partyCard.classList.add('party');
        partyCard.innerHTML = `
        <h2>${party.name}</h2>
        <p>${party.description}</p>
        <p>${party.date}</p>
        <p>${party.location}</p>
      `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Party';
        partyCard.append(deleteButton);

        deleteButton.addEventListener('click', () => deleteParty(party.id));
        return partyCard;
    });

    partyList.replaceChildren(...partyCards);

}

async function addParty(event) {
    event.preventDefault();
    
    try {
        const dateInput = new Date(addPartyForm.date.value);
        const isoDate = dateInput.toISOString();
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: addPartyForm.name.value,
                description: addPartyForm.description.value,
                date: isoDate,
                location: addPartyForm.location.value,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create party");
        }

        render();
    } catch (error) {
        console.error(error);
    }
}

