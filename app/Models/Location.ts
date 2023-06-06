import { DateTime } from 'luxon'
import { BaseModel, HasMany, HasOne, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Order from './Order'
import Branch from './Branch'

export default class Location extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public latitude: number
  
  @column()
  public longitude: number

  @column()
  public address: string

  @column()
  public additionalInformation: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Order)
  public order: HasMany<typeof Order>

  @hasOne(() => Branch)
  public location: HasOne<typeof Branch>
}
