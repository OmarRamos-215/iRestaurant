import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('order_number').nullable()
      table.integer('user_id').notNullable()
      table.integer('branch_id').notNullable()
      table.integer('location_id').nullable()
      table.boolean('finished').notNullable()
      table.integer('payment_method_id').notNullable()
      table.integer('order_type_id').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
