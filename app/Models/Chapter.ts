import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
}
