
function hasKeyword(node, keywords) {
    return keywords.findIndex(v => v.length > 0 && node.innerText.toLowerCase().indexOf(v) >= 0) >= 0
}

function hideChildren(parent, keywords) {
    parent.childNodes.forEach(node => {
        if (hasKeyword(node, keywords)) {
            node.style += " ; display: none;"
        }
    })
}

function getPrioritizedChildren(parent, keywords) {
    return Array.from(parent.childNodes).filter(node => hasKeyword(node, keywords))
}

window.addEventListener('load', () => {
    let main_container = document.querySelector('#search > div > div > div')

    browser.storage.local.get(['excluded_keywords', 'prioritized_keywords']).then(v => {
        let excluded_keywords = v['excluded_keywords'].toLowerCase().split('\n')
        let prioritized_keywords = v['prioritized_keywords'].toLowerCase().split('\n')

        let first_container = main_container.childNodes[0]
        main_container.childNodes.forEach(node => {
            // Google class names are random, so we use some heuristics...
            let h2 = node.querySelector('h2')
            if (h2 && h2.innerText === 'Web results') {
                let result_container = node.querySelector('div')
                hideChildren(result_container, excluded_keywords)
                getPrioritizedChildren(result_container, prioritized_keywords).forEach(node => {
                    result_container.removeChild(node)
                    first_container.insertBefore(node, first_container.firstChild)
                })
            }
            else if (node.innerText.indexOf('People also ask') < 0) {
                hideChildren(node, excluded_keywords)
            }
        })
    })
})