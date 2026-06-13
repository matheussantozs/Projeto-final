export default class BaseDAO {
  constructor(db, tableName) {
    this.db = db
    this.tableName = tableName
  }

  async delete(id) {
    return this.db(this.tableName).where({ id }).delete()
  }
}
