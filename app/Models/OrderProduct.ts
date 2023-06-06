import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import Order from './Order'

export default class OrderProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public quantity: number

  @column()
  public note: string | null

  @column()
  public productId: number

  @column()
  public orderId: number

  @column()
  public modifications: Object | null

  @column()
  public delivered: boolean

  @column()
  public totalPrice: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @belongsTo(() => Order)
  public order: BelongsTo<typeof Order>
}
