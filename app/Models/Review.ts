import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Manga from './Manga'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public mangaId: number

  @column()
  public star: number

  @column()
  public comment: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationship
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Manga)
  public manga: BelongsTo<typeof Manga>
}
