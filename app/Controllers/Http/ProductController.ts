import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product';

export default class ProductsController {
    
    public async index({request}: HttpContextContract)
    {
    const products = await Product.query();
    return products
    }
    
    public async show({request, params}: HttpContextContract)
    {
        try {
            const product = await Product.find(params.id);
            if(product){
            return product
        }
        } catch (error) {
        	console.log(error)
        }
    }
    
    // public async update({auth, request, params}: HttpContextContract)
    // {
    //     const product = await Product.find(params.id);
    //     if (product) {
    //         product.title = request.input('title');
    //         product.content = request.input('desc');
    //         product.done = request.input('done')
            
    //         if (await product.save()) {
    //         	return product
    //     	}
    //     	return; // 422
    //     }
    //     return; // 401
    // }
    
    // public async store({auth, request, response}: HttpContextContract)
    // {
    //     const user = await auth.authenticate();
    //     const product = new Product();
    //     product.title = request.input('title');
    //     product.desc = request.input('desc');
    //     await product.save(product)
    //     return product
    // }
    
    public async destroy({response, auth, request, params}: HttpContextContract)
    {
        const user = await auth.authenticate();
        const product = await Product.query().where('id', params.id).delete();
        return response.json({message:"Deleted successfully"})
    }
}
