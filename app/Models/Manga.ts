import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Review from './Review'
import Chapter from './Chapter'
import Author from './Author'
import Category from './Category'
import Comment from './Comment'
import LikeChapter from './LikeChapter'

export default class Manga extends BaseModel {
  public static STATUS = {
    ACTIVE: 'active',
    DISABLED: 'disabled',
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public authorId: number

  @column()
  public name: string

  @column()
  public image: string

  @column()
  public description: string

  @column()
  public status: 'active' | 'disabled'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationship
  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>

  @hasMany(() => Chapter)
  public chapters: HasMany<typeof Chapter>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => LikeChapter)
  public likes: HasMany<typeof LikeChapter>

  @belongsTo(() => Author)
  public author: BelongsTo<typeof Author>

  // Relationship
  @manyToMany(() => Category, {
    pivotTable: 'manga_categories',
    localKey: 'id',
    pivotForeignKey: 'manga_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'category_id',
    pivotTimestamps: true,
  })
  public categories: ManyToMany<typeof Category>
}
