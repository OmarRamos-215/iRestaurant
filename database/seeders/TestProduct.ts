import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Product from 'App/Models/Product'

export default class extends BaseSeeder {
  public async run () {
    
    await Product.createMany([
      {
        name: 'Torta Sencilla',
        description: 'Torta con lomo, jamon, lechuga y tomate',
        exclusive: false,
        price: 65
      },
      {
        name: 'Torta Especial',
        description: 'Torta con lomo, jamon, lechuga, tomate, queso y aguacate',
        exclusive: false,
        price: 75
      },
      {
        name: 'Torta Ahogada',
        exclusive: false,
        price: 90
      },
      {
        name: 'Refresco',
        description: 'Refresco de la marca Coca-Cola',
        exclusive: false,
        price: 25
      }
    ])

  }
}
