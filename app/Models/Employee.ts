import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Branch from './Branch'

export default class Employee extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public badge: string

  @column()
  public branchId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Branch)
  public branch: BelongsTo<typeof Branch>
}
