import { sessionID, success } from "./module.js"

if (sessionID) {
    if(document.location.pathname != "/chat.html"){
            document.location.href = "chat.html"
    }
    
}

let toggle = document.querySelectorAll(".toggle")
let form = document.querySelectorAll(".login")




toggle.forEach((elements) => {

    elements.onclick = () => {
        form.forEach((forms) => {

            if (forms.classList.contains("show")) {
                forms.classList.remove("show")
                forms.classList.add("hide")
            } else {
                forms.classList.remove("hide")
                forms.classList.add("show")
            }
        })
    }

})

let signup = document.querySelector("#signupform")
let signin = document.querySelector("#logingform")
class Authentication {
    constructor(email, password) {
        this.email = email
        this.password = password
    }

    handleErr(errtype, err) {
        if (errtype && err) {

            document.querySelector(`[data-err=${errtype}]`).textContent = err

            setTimeout(() => {
                document.querySelector(`[data-err=${errtype}]`).textContent = " "
            }, 10000);
        }
    }
    

    async fetchdata() {
        const data = await fetch("http://localhost:8000/users")

        const result = await data.json()

        return result
    }

    async login() {
        try {
            const result = await this.fetchdata()
            let emailExist

            result.forEach((data) => {
                if (data.email == this.email.value) {
                    emailExist = data

                    return
                }
            })

            console.log(emailExist);


            if (emailExist) {
                if (emailExist.password == this.password.value) {
                    this.storeUserSession(emailExist.id)
                    success("login successfull","chat.html")
                    return;
                } else {
                    this.handleErr("lpass", "password is incorrect")
                    return;
                }
            } else {
                this.handleErr("lemail", "email is incorrect")
                return;
            }

        } catch (error) {
            console.log(error);

        }
    }

    async signup() {
        try {
            let data = await this.fetchdata()

            data.forEach(async (singledata) => {

                if (singledata.email == this.email.value) {
                    this.handleErr("semail", "this email already has an account")

                } else {
                    const data = await fetch("http://localhost:8000/users", {
                        method: "POST",
                        headers: {
                            "content": "application/json"
                        },
                        body: JSON.stringify({ email: this.email.value, password: this.password.value })
                    });

                    let result = await data.json()

                    console.log(result)
                    success("signup sucessfull","chat.html")
                    this.storeUserSession(result.id)

                }
            })

        } catch (error) {
            console.log(error);

        }
    }

    storeUserSession(userid) {
        localStorage.setItem("userid", userid)
    }
}
signup.onsubmit = (emma) => {
    emma.preventDefault()
    let signupEmail = signup.email
    let signupPassword = signup.password
    let signupCPass = signup.confirmpass
    let newuser = new Authentication(signupEmail, signupPassword)
    if (signupEmail.value.length < 3 || !(signupEmail.value.includes("@")) || !(signupEmail.value.includes(".com"))) {
        newuser.handleErr("semail", "invalid email");

        return;
    } else if (signupPassword.value.length < 6) {
        newuser.handleErr("spass", "password must be more than 5 characters");

        return;
    } else if (signupCPass.value != signupPassword.value) {

        newuser.handleErr("cpass", "confirm password is not the same as password")
    }
    else {
        newuser.signup()
    }

}

signin.onsubmit = (e) => {
    e.preventDefault()

    let signinEmail = signin.email
    let signinPass = signin.password
    let newuser = new Authentication(signinEmail, signinPass)
    if (signinEmail.value.length < 3 || !(signinEmail.value.includes("@")) || !(signinEmail.value.includes(".com"))) {
        newuser.handleErr("lemail", "invalid email");

        return;
    } else if (signinPass.value.length < 6) {
        newuser.handleErr("lpass", "password must be more than 5 characters");

        return;
    } else {
        newuser.login()
    }
}