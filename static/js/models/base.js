class BaseModel {
  // eslint-disable-line no-unused-vars
  constructor(collectionName) {
    this.collectionName = collectionName
    this.fields = ['id']
  }
  /**
   * @returns {Number}
   */
  getNextId(collection) {
    const collLength = collection.length
    return collLength > 0 ? collection[collLength - 1].id + 1 : collLength + 1
  }
  /**
   * @returns {Object}
   */
  GetEmpty() {
    const entry = {}

    this.fields.forEach((element) => {
      entry[element] = null
    })

    return entry
  }
  /**
   * @returns {Array}
   */
  Select() {
    const stored = localStorage.getItem(this.collectionName)
    const collection = stored ? JSON.parse(stored) : []

    return collection
  }
  SelectByKey(key) {
    const stored = localStorage.getItem(key)
    const collection = stored ? JSON.parse(stored) : []

    return collection
  }
  Commit(collection) {
    localStorage.setItem(this.collectionName, JSON.stringify(collection))
  }
  RemoveStore(name) {
    localStorage.removeItem(name)
  }
  /**
   * @param {Number} id
   * @returns {BaseModel|undefined}
   */
  FindById(id) {
    return this.Select().find((item) => item.id === id)
  }
  /**
   * @param {Number} id
   * @returns {Number}
   */
  FindIndexById(id) {
    return this.Select().findIndex((item) => item.id === id)
  }
  Create(row) {
    const collection = this.Select()
    const entry = this.GetEmpty()

    // entry.id = `${this.getNextId(collection)}_${this.collectionName}`
    entry.id = this.getNextId(collection)
    for (const key in row) {
      if (entry.hasOwnProperty(key) && entry.key !== 'id') {
        entry[key] = row[key]
      }
    }

    collection.push(entry)

    this.Commit(collection)

    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, {
      detail: collection,
    })
    document.dispatchEvent(event)
  }
  Delete(value) {
    const collection = this.Select()
    const entry = []

    const createObject = (row, index) => {
      let entry_inner = {}
      let keys = Object.keys(row)
      // entry_inner['id'] = index
      for (const key in row) {
        entry_inner[key] = row[key]
      }

      return entry_inner
    }

    const checkAllKeys = (row, value) => {
      let res = false
      Object.keys(row).forEach((key) => {
        if (key == 'id' && row[key] == value[key])
          res = true
      })

      return res
    }

    collection.forEach((row, index) => {
      if (!checkAllKeys(row, value)) entry.push(createObject(row, index))
    })

    this.Commit(entry)

    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, {
      detail: entry,
    })
    document.dispatchEvent(event)
  }

  Update(value) {
    const entry = value

    this.Commit(entry)

    const event = new CustomEvent(`${this.collectionName}ListDataChanged`, {
      detail: entry,
    })
    document.dispatchEvent(event)
  }
}
