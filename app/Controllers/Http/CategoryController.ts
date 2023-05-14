import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'

export default class CategoryController {
    public async store({request, response}: HttpContextContract) {
        const {name} = request.body()

        const category = await Category.updateOrCreate({
            name,
        }, {
            name,
        })

        const image = request.file('image')

        if (image) {
            const pathCategory = Application.publicPath(`category/${category.id}`)
            await image.move(pathCategory)
            category.image = image.clientName
            await category.save()
        }

        return response.json(category)
    }

    public async all({request, response}: HttpContextContract) {
        const categories = await Category.all()
        return response.json(categories)
    }
}
