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
            //question.id = response.name
						//return question
						question.id = Math.floor(Math.random() * 100000)
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
            ? questions.sort((a, b) => b.date.localeCompare(a.date)).map(toCard).join('')
            : `<div class="mui--text-headline">You don't have any notes yet</div>`

        const list = document.getElementById('list')

        list.innerHTML = html
    }

    static listToHtml(questions) {
        return questions.length
        ? `<ol>${questions.map(q => `
				<div id=${q.id}>
				<li>${urlify(q.text)}<button class="deletenote">${img}</button></li></div>`).join('')}
				</ol>`
//        ? `<ol>${questions.map(q => `<li>${q.text} // ${q.date}</li>`).join('')}</ol>`
        : '<p>No notes yet</p>'
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

//<div id=${question.id}>
function toCard(question) {
    return `
    <div id=uid${question.id}>
			<div class="mui--text-black-54 note">
					${new Date(question.date).toLocaleDateString("ru-ru")}
					${new Date(question.date).toLocaleTimeString("ru-ru")}
					<button class="removenote" onclick="removeNote(this)">${img}</button>
			</div>
			<div>${urlify(question.text)} </div> 
			
			<br>
		</div>
	`
}

function urlify(text) {
	const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;	// converts the link part of a string to a hyperlink
	const httpRedex = /(^\w+:|^)\/\//; // removes https & http from a link
  return text.replace(urlRegex, url => {
    return '<a href="' + url + '" target="_blank">' + url.replace(httpRedex, '') + '</a>';
  })
  // or alternatively
  // return text.replace(urlRegex, '<a href="$1">$1</a>')
}
