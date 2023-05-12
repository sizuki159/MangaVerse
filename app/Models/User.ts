import { DateTime } from 'luxon'
import { BaseModel, beforeSave, column } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

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
  public status: string

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
}
