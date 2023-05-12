import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Comment from './Comment'
import Manga from './Manga'

export default class Chapter extends BaseModel {
  public static STATUS = {
    ACTIVE: 'active',
    DISABLED: 'disabled',
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public number: number

  @column()
  public mangaId: number

  @column()
  public view: number
  
  @column()
  public source: string

  @column()
  public status: 'active' | 'disabled'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationship
  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @belongsTo(() => Manga)
  public manga: BelongsTo<typeof Manga>
}
