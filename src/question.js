import img from './icons8-delete.svg'

export class Question {
    static create(question) {
        return fetch('https://podcast-69d8c.firebaseio.com/questions.json', {
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            question.id = response.name
            return question
        })
        .then(addToLocalStorage)
        .then(Question.renderList)
    }

    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">You nave no token</p>')
        }
        return fetch(`https://podcast-69d8c.firebaseio.com/questions.json?auth=${token}`)
        .then(response => response.json())
        .then(response => {
            if (response && response.error) {
                return `<p class="error">${response.error}</p>`
            }

            return response ? Object.keys(response).map(key => ({
                ...response[key],
                id: key
            })) : []
        })
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage()

        const html = questions.length
            ? questions.map(toCard).join('')
            : `<div class="mui--text-headline">You don't have any notes yet</div>`

        const list = document.getElementById('list')

        list.innerHTML = html
    }

    static listToHtml(questions) {
        return questions.length
        ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
//        ? `<ol>${questions.map(q => `<li>${q.text} // ${q.date}</li>`).join('')}</ol>`
        : '<p>No question yet</p>'
    }
}

function addToLocalStorage(question) {
    const all = getQuestionsFromLocalStorage()
    all.push(question)
    localStorage.setItem('questions', JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
    return `
    <div id=${question.id}>
        <div class="mui--text-black-54 note">
            ${new Date(question.date).toLocaleDateString("ru-ru")}
            ${new Date(question.date).toLocaleTimeString("ru-ru")}
            <button class="deletenote" onclick="deleteNote(this)">${img}</button>
        </div>
        <div>${question.text} </div> 
        
        <br>
    </div>
    `
}