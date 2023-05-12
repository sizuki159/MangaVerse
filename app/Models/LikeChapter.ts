import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Chapter from './Chapter'

export default class LikeChapter extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public chapterId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationship
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Chapter)
  public chapter: BelongsTo<typeof Chapter>
}
