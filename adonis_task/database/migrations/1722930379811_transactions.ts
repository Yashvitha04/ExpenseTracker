import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Transactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('transaction_id').primary()
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.string('category_name', 255).notNullable()
      table.string('type', 255).notNullable()  
      table.integer('amount').notNullable()
      table.string('description', 255).nullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
