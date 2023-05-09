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

let ID_COUNTER = 0
let ID = ''

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


/**
 * A handler that fires as soon as the user starts dragging on of the order elements.
 * 
 */
const handleDragStart = () => { 

}

/**
 * A handler that fires as soon as the user ends the drag event(on mouse release).
 * The main purpose of this handler is to determine which column the user is 
 * hovering over on the mouse release. This is done in order to change the 
 * styling of the column but also to copy the order over to this specified column
 * @param {event} event 
 */
const handleDragEnd = (event) => {
    //Get info on target order
    const id = event.target.dataset.id
    const over = state.dragging.over
    const ordered = COLUMNS[0]
    let value = ''
    for (const columnName of COLUMNS) {
        value = columnName === over ? columnName : ''
        //check the value of column name to determine which coulumns is being dragged into
        if (columnName === over && columnName === 'ordered') {
            // Call moveToColumn to transfer order over
            moveToColumn(id, columnName)
            const orderedContainer = document.querySelector("body > div.grid > section:nth-child(1)")
            orderedContainer.style.background = 'white'
         }
        if (columnName === over && columnName === 'preparing') {
            moveToColumn(id, columnName)
            const preparingContainer = document.querySelector("body > div.grid > section:nth-child(2)")
            preparingContainer.style.background = 'white'
        }
        if (columnName === over && columnName === 'served') {
            moveToColumn(id, columnName)
            const servedContainer = document.querySelector("body > div.grid > section.grid__column.grid__column_last")
            servedContainer.style.background = 'white'
        }
    }

}

/**
 * This is an event handler that toggles the help overlay of this page. Once the
 * user clicks on the help button, the overlay will appear and the focus will be 
 * set on the cancel button.
 */
const handleHelpToggle = () => {
    //Set focus to cancel button
    const focusItem = document.querySelector('[data-help-cancel]')
    focusItem.focus()
    
    // Change the attribute value of open to true or false on each click
    const help = document.querySelector('[data-help-overlay]')
    help.toggleAttribute('open')

    //Set focu to add button after toggle
    const button = document.querySelector('[data-add]')
    button.focus()

}

/**
 * This event handler toggles the overlay that assists the user in creating a new 
 * order. It is fired as soon as the user clicks the 'Add Order' button.
 */
const handleAddToggle = () => {
    const add = document.querySelector('[data-add-overlay]')
    add.toggleAttribute('open')    


    const inputBox = document.querySelector('[data-add-title]')
    inputBox.value = ''
    inputBox.focus()

    const tableSelector = document.querySelector('[data-add-table]')
    tableSelector.value = '1'

    const focusItemAfter = document.querySelector('[data-add]')
    focusItemAfter.focus()
    
}

/**
 * This is the event handler that fires when the user adds a new order. It saves
 * the table number, time created and the order status. These values are all user 
 * defined.
 * @param {event} event 
 */
const handleAddSubmit = (event) => {
    //Had to prevent default as it was just submitting and going away
    event.preventDefault()
    //Creation of order
    const input = document.querySelector('[data-add-title]')
    const title = input.value
    const id = `order${ID_COUNTER += 1}`
    const table = document.querySelector('[data-add-table]').value
    const created = new Date()
    const order = {
        id: id,
        title: title,
        table: table,
        created: created,
    }

    //Adding order to 'ordered' column
    const container = document.querySelector('[data-column="ordered"]')
    const newElement = createOrderHtml(order)
    container.appendChild(newElement)
    const inputBox = document.querySelector('[data-add-title]')
    inputBox.value = ''

    const tableSelector = document.querySelector('[data-add-table]')
    tableSelector.value = '1'
    
    html.add.cancel.click()
    
    const focusItem = document.querySelector('[data-add]')
    focusItem.focus({focusVisible : true})
    


}

/**
 * This event handler is fired as soon as an existing order is clicked. This will 
 * toggle the edit overlay and allow the user to edit the table number, order status
 * of the selected order.
 * @param {event} event 
 */
const handleEditToggle = (event) => {
    const focusItem = document.querySelector('.overlay__input')
    focusItem.focus({focusVisible : true})

    const edit = document.querySelector('[data-edit-overlay]')
    edit.toggleAttribute('open')    

    const inputBox = document.querySelector('[data-edit-title]')
    inputBox.value = ''

    const tableSelector = document.querySelector('[data-edit-table]')
    tableSelector.value = '1'
    
    ID = event.target.dataset.id

}

/**
 * This eent handler will fire once the user submits the new information entered
 * into the input fields. This will update the current order and assign the new 
 * to it
 * @param {event} event 
 */
const handleEditSubmit = (event) => {
    event.preventDefault()
    const orderParent = document.querySelector(`[data-id="${ID}"]`)
    console.log(orderParent)
    const selection = document.querySelector('[data-edit-column]')
    const value = selection.value
    console.log(value)
    const oldTitlePosition = document.querySelector(`[data-id="${ID}"] > .order__title`)
    const oldTablePosition = document.querySelector(`[data-id="${ID}"] > .order__details .order__row:nth-child(1) > dd`)
    const oldCreated = document.querySelector(`[data-id="${ID}"] > .order__details .order__row:nth-child(2) > dd`)
    console.log(orderParent)
    const newTitle = document.querySelector('[data-edit-title]').value
    const newTable = document.querySelector('[data-edit-table]').value
    let order = {
        id: orderParent.id,
        title: newTitle,
        table: newTable,
        created: new Date()
    }
    orderParent.remove()
    oldTablePosition.innerHTML = newTable
    oldTitlePosition.innerHTML = newTitle 

    const container = document.querySelector(`[data-column="${value}"]`)
    const newElement = createOrderHtml(order)
    container.appendChild(newElement)

    html.edit.cancel.click()

    const focusItem = document.querySelector('[data-add]')
    focusItem.focus({focusVisible : true})
    
}   

/**
 * The main purpose for this event handler is to remove a selected order. It is
 * fired when the 'delete' button in the edit overlay is clicked
 * @param {event} event 
 */

const handleDelete = () => {
    const order = document.querySelector(`[data-id="${ID}"]`)
    order.remove()

    const focusItem = document.querySelector('[data-add]')
    focusItem.focus({focusVisible : true})
    
    html.edit.cancel.click()
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
    htmlColumn.addEventListener('dragstart',handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}