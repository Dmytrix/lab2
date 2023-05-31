'use strict'

const itemModel = new Item() // eslint-disable-line no-undef

function initAddForm() {
  const form = window.document.querySelector('#item-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    const itemData = {}
    formData.forEach((value, key) => {
      itemData[key] = value
    })
    if (itemData.name != '' && itemData.country != '')
      itemModel.Create(itemData)

    e.target.reset()
  })
}

// update form
function initUpdateForm(row) {
  const form = window.document.querySelector('#store-update_el-form')
  const closeBtn = window.document.querySelector('#btn_close')

  closeBtn.addEventListener('click', function (e) {
    e.preventDefault()
    form.style.visibility = 'hidden'
  })

  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)
    const coll_items = itemModel.SelectByKey('items')

    const itemData = {}
    formData.forEach((value, key) => {
      itemData[key] = value
    })

    const res = coll_items.map((el, index) => {
      console.log(el.id, row.id)
      if (el.id == row.id) return { ...itemData, id: el.id }
      return el
    })

    itemModel.Update(res)

    window.location.reload();
    e.target.reset()
  })
}

function initDelete(row) {
  const formData = JSON.parse(row)

  itemModel.Delete(formData)
}

function initUpdate_el(row) {
  const formData = JSON.parse(row)

  const form = window.document.querySelector('#store-update_el-form')
  form.style.visibility = 'visible'

  initUpdateForm(formData)
}

function addEventToDeleteButtons() {
  const elems = document.querySelectorAll('#btn_delete')

  elems.forEach((item) => {
    // console.log('assign: ', item)
    item.addEventListener('click', function () {
      // console.log('addEventListener here')
      initDelete(item.dataset.item)
    })
  })
}

function addEventToUpdateButtons() {
  const elems = document.querySelectorAll('#btn_update')

  elems.forEach((item) => {
    // console.log('assign: ', item)
    item.addEventListener('click', function () {
      // console.log('addEventListener here', item.dataset.item)

      initUpdate_el(item.dataset.item)
    })
  })
}

function initList() {
  window.jQuery('#item-list').DataTable({
    data: itemModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Name', data: 'name' },
      { title: 'Country', data: 'country' },
      {
        data: null,
        title: 'Action',
        wrap: true,
        render: function (item) {
          const def = JSON.stringify(item)
          return `<div>
            <div class="btn-group"> <button type="button"  id="btn_delete" class="btn_delete btn-warning " data-item='${def}'>Delete</button></div>
            <div class="btn-group"> <button type="button"  id="btn_update" class="btn_update btn-primary " data-item='${def}'>Update</button></div>
          </div>`
        },
      },
    ],
  })

  addEventToDeleteButtons()
  addEventToUpdateButtons()
}

function initButtonsEvent() {
  document.addEventListener(
    'itemsListDataChanged',
    function () {
      addEventToDeleteButtons()
      addEventToUpdateButtons()
    },
    false,
  )
}

function initListEvents() {
  document.addEventListener(
    'itemsListDataChanged',
    function (e) {
      const dataTable = window.jQuery('#item-list').DataTable()

      dataTable.clear()
      dataTable.rows.add(e.detail)
      dataTable.draw()
    },
    false,
  )
}

window.addEventListener('DOMContentLoaded', (e) => {
  initAddForm()
  initList()
  initListEvents()
  initButtonsEvent()
})
