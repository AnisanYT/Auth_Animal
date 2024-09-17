const initTemplate = () =>{
    const template = `
        <h1>Animalitos!</h1>
        <form id="form">
            <label>
                Nombre:
            </label>
            <input name="name"/> <br/>
            <label>
                Tipo:
            </label>
            <input name="type"/>
            <br/>
            <button type="submit">Enviar</button>
        </form>
        <ul id="list-animals"></ul>
    `
    const compontent = document.getElementsByTagName('body')[0]
    compontent.innerHTML = template
}

const loadLoginTemplate = () =>{
    const template = `
        <h1>Login!</h1>
        <form id="login-form">
            <label>
                Correo electronico:
            </label>
            <input name="email"/> <br/>
            <label>
                Contrasena:
            </label>
            <input name="password"/>
            <br/>
            <button type="submit">Enviar</button>
        </form>
        <a href="#" id="register">Registrar</a>
        <div id="error"></div>
    `
    const compontent = document.getElementsByTagName('body')[0]
    compontent.innerHTML = template
}

const goToRegisterListener = () => {
    const gotoRegister = document.getElementById("register")
    gotoRegister.onclick = (e) => {
        e.preventDefault()
        registerPage()
    }
}

const addLoginListener = () => {
    const loginForm = document.getElementById("login-form")
    loginForm.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(loginForm)
        const data = Object.fromEntries(formData.entries())

        const response = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
        const responseData = await response.text()
        if (response.status >= 300 ){
            const errorNode = document.getElementById('error')
            errorNode.innerHTML = responseData
        } else {
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            animalsPage()
        }
    }
}

const addFormLister = () => {
    const form = document.getElementById('form')
    form.onsubmit = async (e) => {
        e.preventDefault()
        const formData = new FormData(form)
        const data = Object.fromEntries(formData.entries())
        await fetch('/animal', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('jwt')
                }
            })
        form.reset()
        getAnimals()
    }
}

const getAnimals = async () => {
    const listAnimals = document.getElementById('list-animals')
    const response = await fetch('/animal', {
        headers: {
            Authorization: localStorage.getItem('jwt')
        }
    })
    const data = await response.json()
    const templateList = animal => `
        <li>
            ${animal.name} ${animal.type} 
            <button data-id="${animal._id}">Eliminar</button>
        </li>
    `
    listAnimals.innerHTML = data.map(animal => templateList(animal)).join('')
    data.forEach(
        animal => {
            const nodeAnimals = document.querySelector(`[data-id="${animal._id}"]`)
            nodeAnimals.onclick = async (e) => {
                await fetch(`/animal/${animal._id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: localStorage.getItem("jwt")
                    }
                })
                nodeAnimals.parentNode.remove()
                alert('Eliminado satisfactoriamente!')
            }
        }
    )
}

const checkLogin = () => localStorage.getItem('jwt')
const animalsPage = () => {
    initTemplate()
    addFormLister()
    getAnimals()
}

const loadRegisterTemplate = () => {
    const template = `
        <h1>Register!</h1>
        <form id="register-form">
            <label>
                Correo electronico:
            </label>
            <input name="email"/> <br/>
            <label>
                Contrasena:
            </label>
            <input name="password"/>
            <br/>
            <button type="submit">Enviar</button>
        </form>
        <a href="#" id="login">Login</a>
        <div id="error"></div>
    `
    const compontent = document.getElementsByTagName('body')[0]
    compontent.innerHTML = template
}

const addRegisterListener = () => {
    const registerForm = document.getElementById("register-form")
    registerForm.onsubmit = async (e) => {
        e.preventDefault()
        const registerData = new FormData(registerForm)
        const data = Object.fromEntries(registerData.entries())
        
        const response = await fetch('/register', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const responseData = await response.text()
        if (response.status >= 300) {
            const errorNode = document.getElementById("error")
            errorNode.innerHTML = responseData
        } else {
            console.log(responseData)
            localStorage.setItem('jwt', `Bearer ${responseData}`)
            animalsPage()
        }
    }
}

const gotoLoginListener = () => {
    
}

const registerPage = () => {
    loadRegisterTemplate()
    addRegisterListener() 
    gotoLoginListener()     //Aun sin crear
}

const loginPage = () => {
    loadLoginTemplate()
    addLoginListener()
    goToRegisterListener()
}
window.onload = () => {
    const isLogin = checkLogin()
    if (isLogin) {
        animalsPage()
    } else {
        loginPage()
    }
}