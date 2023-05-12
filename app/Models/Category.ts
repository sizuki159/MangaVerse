import { DateTime } from 'luxon'
import { BaseModel, ManyToMany, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Manga from './Manga'

export default class Category extends BaseModel {
  public static STATUS = {
    ACTIVE: 'active',
    DISABLED: 'disabled',
  }
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public status: 'active' | 'disabled'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Relationship
  @manyToMany(() => Manga, {
    pivotTable: 'manga_categories',
    localKey: 'id',
    pivotForeignKey: 'category_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'manga_id',
    pivotTimestamps: true,
  })
  public mangas: ManyToMany<typeof Manga>
  
}
