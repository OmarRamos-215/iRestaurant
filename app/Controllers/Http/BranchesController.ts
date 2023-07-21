import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Branch from 'App/Models/Branch';

export default class BranchesController {
    public async getBranchNames({response}: HttpContextContract){
        try {
            const branches = await Branch.query().select('name');
            return response.json(branches.map((branch) => branch.name));
        } catch (error) {
        	console.log(error)
        }
    }
}
