import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Manga from 'App/Models/Manga'

export default class extends BaseSchema {
  protected tableName = 'manga'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('name')
      table.text('image')
      table.text('description')
      table.enu('status', Object.values(Manga.STATUS)).defaultTo(Manga.STATUS.ACTIVE)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true }).nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
