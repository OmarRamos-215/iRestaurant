import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Branch from './Branch'
import Product from './Product'

export default class BranchPrice extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public alternativePrice: number

  @column()
  public branchId: number

  @column()
  public productId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Branch)
  public branch: BelongsTo<typeof Branch>

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>
}
