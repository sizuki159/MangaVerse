import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Chapter from 'App/Models/Chapter'

export default class extends BaseSchema {
  protected tableName = 'chapters'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('name')
      table.integer('number').unsigned()
      table.integer('manga_id').unsigned().references('id').inTable('manga').onDelete('CASCADE')
      table.bigInteger('view').defaultTo(0)
      table.text('source')
      table.enu('status', Object.values(Chapter.STATUS)).defaultTo(Chapter.STATUS.ACTIVE)

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
