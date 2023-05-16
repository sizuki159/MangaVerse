import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Manga from 'App/Models/Manga'
import Env from '@ioc:Adonis/Core/Env'

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

        return response.created({
            message: 'Thêm hoặc update category thành công',
            data: category,
        })
    }

    public async getMangaByCategoryId({request, response, params}: HttpContextContract) {
        const categoryId = params.categoryId
        const category = await Category.findOrFail(categoryId)
        await category.load('mangas')
        for(let i = 0; i < category.mangas.length; i++) {
            category.mangas[i].image = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${category.mangas[i].id}/${category.mangas[i].image}`
        }
        return response.json(category)
    }

    public async all({request, response}: HttpContextContract) {
        const categories = await Category.all()
        return response.json(categories)
    }
}
