import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Comment from './Comment'
import Review from './Review'
import LikeChapter from './LikeChapter'
import Follow from './Follow'

export default class User extends BaseModel {

  public static STATUS = {
    ACTIVE: 'active',
    DISABLED: 'disabled',
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string  

  @column({serializeAs: null})
  public password: string

  @column()
  public fullname: string | null

  @column()
  public avatar: string | null

  @column()
  public status: 'active' | 'disabled'

  @column()
  public isEmailVerified: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // Hooks
  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // Relationship
  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>

  @hasMany(() => LikeChapter)
  public likeChapters: HasMany<typeof LikeChapter>

  @hasMany(() => Follow)
  public follows: HasMany<typeof Follow>

}
