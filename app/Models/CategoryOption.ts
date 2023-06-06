import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Category from './Category'
import ProductTag from './ProductTag'
import Order from './Order'

export default class CategoryOption extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public categoryId: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @hasMany(() => ProductTag)
  public productTag: HasMany<typeof ProductTag>

  @hasMany(() => Order)
  public order: HasMany<typeof Order>
}
