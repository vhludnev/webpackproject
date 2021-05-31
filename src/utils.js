export function isValid(value) {
    return value.length >= 10
}

// creates modal window after successful login

export function createModal(title, content) {
    const modal = document.createElement('div')
    modal.classList.add('modal')

    modal.innerHTML = `
    <h1>${title}</h1>
    <div class="modal-content">${content}</div>
    `

    var options = {
        'keyboard': false,                         // teardown when <esc> key is pressed (default: true)
        'onclose': function() {mui.overlay('off')} // execute function when overlay is closed
      };
    mui.overlay('on', options, modal)
}