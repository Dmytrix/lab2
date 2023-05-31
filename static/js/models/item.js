class Item extends BaseModel { // eslint-disable-line no-unused-vars, no-undef
    constructor () {
      super('items')
      this.fields = this.fields.concat(['name', 'country'])
    }
  }
  