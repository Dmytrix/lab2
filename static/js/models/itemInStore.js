class ItemInStore extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('itemInStores')
      this.fields = this.fields.concat(['storeId', 'itemId'])
    }
  }
  