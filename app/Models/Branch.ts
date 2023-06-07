import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, HasOne, belongsTo, column, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Employee from './Employee'
import Order from './Order'
import Location from './Location'
import Product from './Product'
import BranchExclusive from './BranchExclusive'
import BranchPrice from './BranchPrice'

export default class Branch extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public locationId: number

  @column()
  public openTime: string

  @column()
  public closeTime: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Employee)
  public employee: HasMany<typeof Employee>

  @hasMany(() => Order)
  public order: HasMany<typeof Order>

  @belongsTo(() => Location)
  public location: BelongsTo<typeof Location>

  @hasMany(() => Product)
  public product: HasMany<typeof Product>

  @hasMany(() => BranchExclusive)
  public branchExclusive: HasMany<typeof BranchExclusive>

  @hasMany(() => BranchPrice)
  public branchPrice: HasMany<typeof BranchPrice>
}
