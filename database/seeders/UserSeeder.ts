import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        email: 'trungnt2411@gmail.com',
        password: 'Trung@123',
        fullname: 'Nguyễn Thành Trung',
      }
    ])
  }
}
