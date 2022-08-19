window.onload = GetPeople();
const form = document.querySelector("#form");

async function GetPeople() {
    fetch("https://reqres.in/api/users")
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                return response.json();
            }
        })
        .then((json) => {
            json.data.map((person) => {
                AddPersonRow(person);
            });
        });
}

document.querySelector("#add-btn").addEventListener("click", () => {
    modal.querySelector("#modalLabel").textContent = "Add a brainiac";
    ClearFormFields();
});

function ClearFormFields() {
    form.elements["first-name"].value = "";
    form.elements["last-name"].value = "";
    form.elements["email"].value = "";
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (document.querySelector("#modalLabel").textContent != "Update a brainiac"){ //checks if the form is supposed to add a new brainiac
        CreatePerson();
    }
    $("#modal").modal("hide");
});

async function CreatePerson() {
    let res;
    const person = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            first_name: form.elements["first-name"].value,
            last_name: form.elements["last-name"].value,
            email: form.elements["email"].value,
            avatar: null,
        }),
    })
        .then((response) => {
            console.log(response);
            res = response;
            return response.json();
        })
        .then((data) => data);
    if (res.status === 201) {
        AddPersonRow(person);
    }
}

function AddPersonRow(person) {
    let tr = document.createElement("tr");
    tr.id = "row-id-" + person.id; //handle for manipulating the row
    tr.className = "align-middle";

    let td = document.createElement("td");
    td.textContent = person.id;
    td.className = "id";
    tr.appendChild(td);

    const id = person.id; //value to be passed to a function

    td = document.createElement("td");
    if (person.avatar) {
        let img = document.createElement("img");
        img.src = person.avatar;
        img.height = img.width = 64;
        td.appendChild(img);
    }
    tr.appendChild(td);

    td = document.createElement("td");
    td.textContent = person.first_name;
    td.className = "firstName";
    tr.appendChild(td);

    td = document.createElement("td");
    td.textContent = person.last_name;
    td.className = "lastName";
    tr.appendChild(td);

    td = document.createElement("td");
    td.textContent = person.email;
    td.className = "email";
    tr.appendChild(td);

    td = document.createElement("td");
    let btn = document.createElement("button");
    btn.className = "btn btn-primary btn-right my-btn";
    let i = document.createElement('i');
    i.className = "fa-solid fa-trash";
    btn.appendChild(i);
    btn.onclick = function () {
        DeletePerson(id);
    };
    td.appendChild(btn);

    btn = document.createElement("button");
    btn.className = "btn btn-primary btn-right me-3 my-btn";
    i = document.createElement('i');
    i.className = "fa-solid fa-pen-to-square";
    btn.appendChild(i);

    btn.setAttribute("data-bs-toggle", "modal");
    btn.setAttribute("data-bs-target", "#modal");
    btn.onclick = function () {
        UpdatePerson(id);
    };
    td.appendChild(btn);

    tr.appendChild(td);

    document.querySelector("#tbody").appendChild(tr);
}

async function DeletePerson(id) {
    const url = "https://reqres.in/api/users/" + id;
    const res = await fetch(url, { method: "DELETE" }).then((response) => {
        console.log(response);
        return response;
    });
    if (res.status == 204) {
        const rowToRemove = document.querySelector("#row-id-" + id);
        rowToRemove.remove();
    }
}

function UpdatePerson(id) {
    const url = "https://reqres.in/api/users/" + id;
    const rowToUpdate = document.querySelector("#row-id-" + id);
    const modal = document.querySelector("#modal");

    form.addEventListener(
        "submit",
        (event) => {
            event.preventDefault();
            MakeChanges(url, rowToUpdate);
        },
        { once: true }
    );

    modal.querySelector("#modalLabel").textContent = "Update a brainiac";
    modal.querySelector('input[name="first-name"]').value =
        document.querySelector(`#row-id-${id} .firstName`).textContent;
    modal.querySelector('input[name="last-name"]').value =
        document.querySelector(`#row-id-${id} .lastName`).textContent;
    modal.querySelector('input[name="email"]').value = document.querySelector(
        `#row-id-${id} .email`
    ).textContent;
}

async function MakeChanges(url, rowToUpdate) {
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            first_name: form.elements["first-name"].value,
            last_name: form.elements["last-name"].value,
            email: form.elements["email"].value,
        }),
    });
    console.log(res);
    rowToUpdate.querySelector(".firstName").textContent =
        form.elements["first-name"].value;
    rowToUpdate.querySelector(".lastName").textContent =
        form.elements["last-name"].value;
    rowToUpdate.querySelector(".email").textContent =
        form.elements["email"].value;
}