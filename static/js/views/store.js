'use strict'

const storeModel = new Store() // eslint-disable-line no-undef

function initAddForm() {
  const form = window.document.querySelector('#store-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    const storeData = {}
    formData.forEach((value, key) => {
      storeData[key] = value
    })

    // storeModel.Create(storeData)

    // console.log(formData.shop)

    storeModel.SelectByKey('shops').forEach((el) => {
      //   console.log(storeData.shopId, el.id)
      if (el.id == storeData.shopId && storeData.quantity != '') {
        storeModel.Create(storeData)
      }
    })

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
    const coll_stores = storeModel.SelectByKey('stores')
    const coll_shops = storeModel.SelectByKey('shops')

    const storeData = {}
    formData.forEach((value, key) => {
      storeData[key] = value
    })

    function checkIsIdInShops(id) {
      let resIsIn = false
      coll_shops.forEach((el_shop) => {
        // console.log(el_shop, id)
        if (id == el_shop.id) resIsIn = true
      })
      return resIsIn
    }

    const res = coll_stores.map((el, index) => {
      if (el.id == row.id && checkIsIdInShops(storeData.shopId))
        return { ...storeData, id: el.id }
      return el
    })

    // const res_res = []

    storeModel.Update(res)

    window.location.reload()
    e.target.reset()
  })
}

function initDelete(row) {
  const formData = JSON.parse(row)

  storeModel.Delete(formData)
}
function initUpdate_el(row) {
  const formData = JSON.parse(row)

  const form = window.document.querySelector('#store-update_el-form')
  form.style.visibility = 'visible'

  initUpdateForm(formData)
}

function initUpdateAllForm() {
  const form = window.document.querySelector('#store-update-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const coll_shops = storeModel.SelectByKey('shops')
    const coll_stores = storeModel.SelectByKey('stores')

    const storeData = []

    console.log(coll_shops, coll_stores)

    coll_stores.forEach((el_store) => {
      coll_shops.forEach((el_shop) => {
        // console.log(el_store.shopId, el_shop.id)
        if (
          el_store.shopId == el_shop.id &&
          !JSON.stringify(storeData).includes(JSON.stringify(el_store))
        )
          storeData.push(el_store)
      })
    })

    storeModel.Update(storeData)

    e.target.reset()
  })
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
  window.jQuery('#store-list').DataTable({
    data: storeModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'ShopId', data: 'shopId' },
      { title: 'Quantity', data: 'quantity' },
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
    'storesListDataChanged',
    function () {
      addEventToDeleteButtons()
      addEventToUpdateButtons()
    },
    false,
  )
}
function initListEvents() {
  document.addEventListener(
    'storesListDataChanged',
    function (e) {
      const dataTable = window.jQuery('#store-list').DataTable()

      dataTable.clear()
      dataTable.rows.add(e.detail)
      dataTable.draw()
    },
    false,
  )
}

window.addEventListener('DOMContentLoaded', (e) => {
  initAddForm()
  initUpdateAllForm()
  initList()
  initListEvents()
  initButtonsEvent()
})
