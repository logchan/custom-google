function addLog(msg) {
    logs = document.getElementById('logs-area')
    logs.appendChild(createTagWithText('p', msg))
}

options_def = new options_group('Transparent search modifications', 'Modify your search queries and results in a transparent way.', [
    new textarea_option_entry('Excluded keywords', 'excluded_keywords'),
    new textarea_option_entry('Prioritized keywords', 'prioritized_keywords')
])

let loader = new options_loader(document.getElementById('options-area'))
loader.load(options_def)