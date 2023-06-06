import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Branch from './Branch'
import Location from './Location'
import CategoryOption from './CategoryOption'
import OrderProduct from './OrderProduct'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public orderNumber: number

  @column()
  public userId: number

  @column()
  public branchId: number

  @column()
  public locationId: number | null

  @column()
  public finished: boolean

  @column()
  public paymentMethodId: number

  @column()
  public orderTypeId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Branch)
  public branch: BelongsTo<typeof Branch>

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @belongsTo(() => CategoryOption)
  public paymentMethod: BelongsTo<typeof CategoryOption>

  @belongsTo(() => CategoryOption)
  public orderType: BelongsTo<typeof CategoryOption>

  @hasMany(() => OrderProduct)
  public orderProduct: HasMany<typeof OrderProduct>
}
