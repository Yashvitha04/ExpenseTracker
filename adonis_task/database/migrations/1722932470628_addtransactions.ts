import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddTimestampsToTransactions extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.timestamp('created_at', { useTz: true }).notNullable().defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).notNullable().defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('created_at')
      table.dropColumn('updated_at')
    })
  }

}
