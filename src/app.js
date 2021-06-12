import {isValid} from './utils'
import {Question, getQuestionsFromLocalStorage, deleteNote} from './question'
import {createModal} from './utils'
import {getAuthForm} from './auth'
import {authWithEmailAndPassword} from './auth'
import './styles.css'

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')

/* form.onsubmit = SubmitFormHandler() */
window.addEventListener('load', Question.renderList) /* the list of questions will stay on the page after refresh */
form.addEventListener('submit', SubmitFormHandler)
modalBtn.addEventListener('click', openModal)
form.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value)
})

function SubmitFormHandler(event) {
    event.preventDefault()

    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }

        submitBtn.disabled = true
        // Async request to server to save the question
        Question.create(question).then( () => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
    }
}

function openModal() {
    createModal('Log in', getAuthForm())
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true}) /* {once: true} will add this occation only once */
}

function authFormHandler(event) {
    event.preventDefault() /* prevents page reload */

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value
    const password = event.target.querySelector('#password').value

    btn.disabled = true
    authWithEmailAndPassword(email, password)
        .then(Question.fetch) /* this is the much shorter version of: */
        /* .then(token => { 
            return Question.fetch(token) 
        }) */
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Error', content)
    } else {
        createModal('List of notes', Question.listToHtml(content));
    }
}



