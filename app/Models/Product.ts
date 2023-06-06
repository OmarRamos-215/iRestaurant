import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import BranchExclusive from './BranchExclusive'
import BranchPrice from './BranchPrice'
import Branch from './Branch'
import ProductTag from './ProductTag'
import ProductModification from './ProductModification'
import OrderProduct from './OrderProduct'

export default class Product extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public branchId: number

  @column()
  public image: string | null

  @column()
  public exlclusive: boolean

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Branch)
  public branch: BelongsTo<typeof Branch>

  @hasMany(() => BranchExclusive)
  public branchExclusive: HasMany<typeof BranchExclusive>

  @hasMany(() => BranchPrice)
  public branchPrice: HasMany<typeof BranchPrice>

  @hasMany(() => ProductTag)
  public productTag: HasMany<typeof ProductTag>

  @hasMany(() => ProductModification)
  public productModification: HasMany<typeof ProductModification>

  @hasMany(() => OrderProduct)
  public orderProduct: HasMany<typeof OrderProduct>
}
