import {createOrderHtml, updateDraggingHtml, moveToColumn, html} from './view.js';
import {TABLES, COLUMNS, state, createOrderData,updateDragging} from './data.js'
/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */

let ID = 0
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}



const handleDragStart = (event) => {

}

const handleDragEnd = (event) => {

}

const handleHelpToggle = (event) => {
    const help = document.querySelector('[data-help-overlay]')
    help.toggleAttribute('open')

    const button = document.querySelector('[data-add]')
    button.focus({focusVisible : true})

}

const handleAddToggle = (event) => {
    const add = document.querySelector('[data-add-overlay]')
    add.toggleAttribute('open')    

    const button = document.querySelector('[data-add]')
    button.focus({focusVisible : true})

    const inputBox = document.querySelector('[data-add-title]')
    inputBox.value = ''

    const tableSelector = document.querySelector('[data-add-table]')
    tableSelector.value = '1'
}

const handleAddSubmit = (event) => {
    event.preventDefault()
    const input = document.querySelector('[data-add-title]')
    const title = input.value
    const id = `order${ID += 1}`
    const table = document.querySelector('[data-add-table]').value
    const created = new Date()
    const order = {
        id: id,
        title: title,
        table: table,
        created: created,
    }
    const container = document.querySelector('[data-column="ordered"]')
    const newElement = createOrderHtml(order)
    container.appendChild(newElement)

    const inputBox = document.querySelector('[data-add-title]')
    inputBox.value = ''

    const tableSelector = document.querySelector('[data-add-table]')
    tableSelector.value = '1'
    
    html.add.cancel.click()

}

const handleEditToggle = (event) => {
    const edit = document.querySelector('[data-edit-overlay]')
    edit.toggleAttribute('open')    

    const button = document.querySelector('Update')
    // button.focus({focusVisible : true})

    const inputBox = document.querySelector('[data-edit-title]')
    inputBox.value = ''

    const tableSelector = document.querySelector('[data-edit-table]')
    tableSelector.value = '1'
}

const handleEditSubmit = (event) => {
    
    
}

const handleDelete = (event) => {

}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}