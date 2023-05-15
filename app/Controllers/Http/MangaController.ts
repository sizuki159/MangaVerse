import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Manga from 'App/Models/Manga'
import Application from '@ioc:Adonis/Core/Application'

export default class MangaController {
    public async all({request, response}: HttpContextContract) {
        const categories = await Manga.all()
        return response.json(categories)
    }

    public async store({request, response}: HttpContextContract) {
        const {name, description} = request.body()

        const manga = await Manga.create({
            name,
            description
        })

        const image = request.file('image')
        if (image) {
            const pathManga = Application.publicPath(`manga/${manga.id}`)
            await image.move(pathManga)
            manga.image = image.clientName
            await manga.save()
        }

        return response.created({
            message: 'Thêm manga thành công',
            data: manga,
        })
    }

}
