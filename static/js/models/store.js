class Store extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('stores')
      this.fields = this.fields.concat(['shopId', 'quantity'])
    }
  }
  