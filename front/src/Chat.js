import Message from "./Message";
import EventEmitter from "./EventEmitter";

export default class Chat extends EventEmitter {
	constructor() {
		super();

		this.messages = [];
		this.user = { id: null };

		this.view = document.createElement("div");
		this.view.innerHTML = template;
		this.view = this.view.firstElementChild;

		this.button = this.view.querySelector("button");
		this.button.addEventListener("click", (e) => this.handlerClick(e));

		this.input = this.view.querySelector("input");
		this.input.addEventListener("keyup", (e) => this.handlerKeyup(e));
	}

	addMessage(data) {
		const message = new Message(data.user, data.date, data.content);
		this.messages.push(message);
		this.view.querySelector("[data-messages]").append(message.view);
	}

	clearInput() {
		this.input.value = "";
	}

	handlerClick(e) {
		if (this.input.value) {
			this.emit("send", this.input.value);
		}
	}

	handlerKeyup(e) {
		if (e.key === "Enter") {
			this.emit("send", this.input.value);
		}
	}
}

const template = `
<div class="main">
    <div class="container">
        <div class="chat__header">
            <h2 class="chat__title">Онлайн чат</h2>
        </div>
        <div class="chat__body" data-messages></div>
        <div class="chat__footer">
            <form action="#" class="form">
                <input type="text" class="form__input">
                <button class="form_btn">отправить</button>
            </form>
        </div>
    </div>
</div>`