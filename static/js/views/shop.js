'use strict'

const shopModel = new Shop() // eslint-disable-line no-undef

function initAddForm() {
  const form = window.document.querySelector('#shop-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    const shopData = {}
    formData.forEach((value, key) => {
      shopData[key] = value
    })

    if (shopData.name != '' && shopData.address != '')
      shopModel.Create(shopData)

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
    const coll_shops = shopModel.SelectByKey('shops')

    const shopData = {}
    formData.forEach((value, key) => {
      shopData[key] = value
    })

    const res = coll_shops.map((el, index) => {
      console.log(el.id, row.id)
      if (el.id == row.id) return { ...shopData, id: el.id }
      return el
    })

    shopModel.Update(res)

    window.location.reload();
    e.target.reset()
  })
}

function initDelete(row) {
  const formData = JSON.parse(row)

  shopModel.Delete(formData)
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
  window.jQuery('#shop-list').DataTable({
    data: shopModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'Name', data: 'name' },
      { title: 'Address', data: 'address' },
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
    'shopsListDataChanged',
    function () {
      addEventToDeleteButtons()
      addEventToUpdateButtons()
    },
    false,
  )
}

function initListEvents() {
  document.addEventListener(
    'shopsListDataChanged',
    function (e) {
      const dataTable = window.jQuery('#shop-list').DataTable()

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
