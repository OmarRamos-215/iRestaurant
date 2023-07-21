import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Branch from 'App/Models/Branch'

export default class extends BaseSeeder {
  public async run () {
    
    await Branch.createMany([
      {
        name: "Branch 2",
        locationId: 1,
        openTime: "11:00",
        closeTime: "20:00",
      },
      {
        name: "Branch 3",
        locationId: 1,
        openTime: "10:00",
        closeTime: "22:00",
      },
    ])
  }
}
