export default class Message {
    constructor (author, date, content) {
        this.author = author
        this.date = new Date(date)
        this.content = content

        this.view = document.createElement("div")

        this.view.innerHTML = template
            .replace('%USER%', this.author)
            .replace('%DATE%', `${this.date.getHours()}:${this.date.getMinutes()}:${this.date.getSeconds()}`)
            .replace('%MESSAGE%', this.content)

        this.view = this.view.firstElementChild
    }
}

const template = `
<div class="message">
    <div class="message__info">
        <span class="message__user">%USER%</span>
        <span class="message__date">%DATE%</span>
    </div>
    <p class="message__content">%MESSAGE%</p>
</div>
`