import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public transaction_id: number

  @column()
  public user_id: number

  @column()
  public category_name: string

  @column()
  public type: string

  @column()
  public amount: number

  @column()
  public description: string | null

  @belongsTo(() => User, {
    foreignKey: 'user_id',
  })
  public user: BelongsTo<typeof User>
}
