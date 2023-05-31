'use strict'

const itemInStoreModel = new ItemInStore() // eslint-disable-line no-undef

function initAddForm() {
  const form = window.document.querySelector('#itemInStore-add-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const formData = new FormData(e.target)

    const itemInStoreData = {}
    formData.forEach((value, key) => {
      itemInStoreData[key] = value
    })

    if (
      parseInt(itemInStoreData.storeId) > 0 &&
      parseInt(itemInStoreModel.SelectByKey('items').length) >=
        parseInt(itemInStoreData.itemId) &&
      parseInt(itemInStoreData.itemId) > 0
    ) {
      itemInStoreModel.Create(itemInStoreData)
    }
    e.target.reset()
  })
}

function initDelete(row) {
  const formData = JSON.parse(row)

  // console.log(row)
  itemInStoreModel.Delete(formData)
}

function initUpdateForm() {
  const form = window.document.querySelector('#itemInStore-update-form')
  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const coll_store = itemInStoreModel.SelectByKey('stores')
    const coll_itemInStores = itemInStoreModel.SelectByKey('itemInStores')

    const storeData = []

    coll_itemInStores.forEach((el_itemInStores) => {
      coll_store.forEach((el_store) => {
        console.log(el_itemInStores.storeId, el_store.shopId)
        if (
          el_itemInStores.storeId == el_store.shopId &&
          !JSON.stringify(storeData).includes(JSON.stringify(el_itemInStores))
        )
          storeData.push(el_itemInStores)
      })
    })

    itemInStoreModel.Update(storeData)

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

function initList() {
  window.jQuery('#itemInStore-list').DataTable({
    data: itemInStoreModel.Select(),
    columns: [
      { title: 'ID', data: 'id' },
      { title: 'StoreId', data: 'storeId' },
      { title: 'ItemId', data: 'itemId' },
      {
        data: null,
        title: 'Action',
        wrap: true,
        render: function (item) {
          const def = JSON.stringify(item)
          return `<div class="btn-group"> <button type="button"  id="btn_delete" class="btn_delete btn-warning " data-item='${def}'>Delete</button></div>`
        },
      },
    ],
  })

  addEventToDeleteButtons()
}

function initButtonsEvent() {
  document.addEventListener(
    'itemInStoresListDataChanged',
    function () {
      addEventToDeleteButtons()
    },
    false,
  )
}

function initListEvents() {
  document.addEventListener(
    'itemInStoresListDataChanged',
    function (e) {
      const dataTable = window.jQuery('#itemInStore-list').DataTable()

      dataTable.clear()
      dataTable.rows.add(e.detail)
      dataTable.draw()
    },
    false,
  )
}

window.addEventListener('DOMContentLoaded', (e) => {
  initAddForm()
  initUpdateForm()
  initList()
  initListEvents()
  initButtonsEvent()
})
