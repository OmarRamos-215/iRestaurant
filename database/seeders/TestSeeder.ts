import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Branch from 'App/Models/Branch'
import Employee from 'App/Models/Employee'
import Location from 'App/Models/Location'
import Role from 'App/Models/Role'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {

    const roles = await Role.createMany([
      {
        role: 'client'
      },
      {
        role: 'system'
      },
      {
        role: 'admin'
      },
      {
        role: 'cashier'
      },
      {
        role: 'waiter'
      }, 
    ])

    const location = await Location.create({
      latitude: 28.6617164,
      longitude: -106.0403762,
      address: 'UTCH BIS'
    })


    const branch = await Branch.create({
      name: 'IRestaurant',
      locationId: location.id,
      openTime: '12:00',
      closeTime: '22:00'
    })


    const systemRole = roles.find(role => role.role == 'system')
    await User.create({
      email: 'system@system.com',
      password: 'system123',
      firstName: 'System',
      lastName: 'User',
      roleId: systemRole?.id
    })

    const clientRole = roles.find(role => role.role == 'client')
    await User.create({
      email: 'client@client.com',
      password: 'client123',
      firstName: 'Client',
      lastName: 'User',
      roleId: clientRole?.id
    })

    const cashierRole = roles.find(role => role.role == 'client')
    const cashierUser = await User.create({
      email: 'cashier@cashier.com',
      password: 'cashier123',
      firstName: 'Cashier',
      lastName: 'User',
      roleId: cashierRole?.id
    })

    await Employee.create({
      badge: 'emp001',
      userId: cashierUser.id,
      branchId: branch.id
    })

  }
}
