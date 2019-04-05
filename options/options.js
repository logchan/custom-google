/**
 * @param {string} tagName 
 * @param {string} text 
 * @returns {HTMLElement}
 */
function createTagWithText(tagName, text) {
    let tag = document.createElement(tagName)
    tag.appendChild(document.createTextNode(text))
    return tag
}

class option_entry {
    constructor () {
        if (new.target === option_entry) {
            throw new TypeError("Attempting to instiantiate abstract class option_entry")
        }
    }

    /**
     * @param {HTMLElement} parent 
     */
    render (parent) {
        throw new TypeError("Attempting to call abstract function render")
    }

    load () {
        let key = this.getKey()
        browser.storage.local.get(key).then(v => {
            this.setValue(v[key])
        }, reason => {
            throw reason
        })
    }

    save () {
        let data = { }
        data[this.getKey()] = this.getValue()
        browser.storage.local.set(data)
    }

    getKey () {
        return null;
    }

    getValue () {
        return null;
    }

    setValue (v) {

    }
}

class button_option_entry extends option_entry {
    /**
     * @param {string} name 
     * @param {Function} callback 
     */
    constructor (name, callback) {
        super()
        this.name = name
        this.callback = callback
    }

    /**
     * @param {HTMLElement} parent 
     */
    render (parent) {
        let button = createTagWithText("button", this.name)
        parent.appendChild(button)
        button.addEventListener('click', this.callback)
    }
}

class textarea_option_entry extends option_entry {
    /**
     * @param {string} name 
     * @param {string} key
     */
    constructor (name, key) {
        super()
        this.name = name
        this.key = key
        this.box = null
    }

    /**
     * @param {HTMLElement} parent 
     */
    render (parent) {
        let title = createTagWithText('p', this.name)
        parent.appendChild(title)
        let box = document.createElement('textarea')
        parent.appendChild(box)
        box.addEventListener('change', () => {
            this.save()
        })
        this.box = box
    }

    getKey () {
        return this.key;
    }

    getValue () {
        return this.box.value;
    }

    setValue (v) {
        this.box.value = v
    }
}

class options_group {
    /**
     * @param {string} name 
     * @param {string} description 
     * @param {option_entry[]} entries 
     * @param {options_group[]} children 
     */
    constructor (name, description, entries, children) {
        this.name = name || ""
        this.description = description || ""
        this.entries = entries || []
        this.children = children || []
    }

    /**
     * @param {HTMLElement} parent 
     * @param {number} level 
     */
    render (parent, level) {
        let nameTagName = level > 6 ? "p" : `h${level}`
        parent.appendChild(createTagWithText(nameTagName, this.name))
        parent.appendChild(createTagWithText("p", this.description))
        
        let optionsContainer = document.createElement("div")
        parent.appendChild(optionsContainer)
        this.entries.forEach(e => e.render(optionsContainer))
        
        let childrenContainer = document.createElement("div")
        parent.appendChild(childrenContainer)
        this.children.forEach(e => e.render(childrenContainer, level + 1))
    }

    load () {
        this.entries.forEach(e => e.load())
        this.children.forEach(c => c.load())
    }
}

class options_loader {
    /**
     * @param {HTMLElement} container 
     */
    constructor (container) {
        this.container = container
    }

    /**
     * @param {options_group} root 
     */
    load (root) {
        root.render(this.container, 2)
        root.load()
    }
}
