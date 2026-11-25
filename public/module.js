export const sessionID = localStorage.getItem("userid")

export function success(msg,location) {
    let success = document.querySelector("#success")
    let successMessage = document.querySelector(".message")

    success.classList.contains("hide-success") ? success.classList.remove("hide-success"): success.classList.add("hide-success")

    successMessage.innerHTML = msg

    setTimeout(() => {
        document.location.href = location
    }, 4000);
}

export async function fetchuser() {
        const data = await fetch("http://localhost:8000/users")

        const result = await data.json()

        return result
    }

    export async function fetchsingleuser(id) {
        const data = await fetch(`http://localhost:8000/users/${id}`)

        const result = await data.json()

        return result
    }

    export async function updateUser(id, status) {
    const response = await fetch(`http://localhost:8000/users/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            isonline: status
        })
    });

    const data = await response.json();

    return data;
}
