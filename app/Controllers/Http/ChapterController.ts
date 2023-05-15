import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Manga from 'App/Models/Manga'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

export default class ChapterController {
    public async store({request, response, params}: HttpContextContract) {
        const manga = await Manga.findOrFail(params.mangaId)

        const {name, number, source} = request.body()

        const chapter = await manga.related('chapters').create({
            name,
            number,
        })

        const sources = request.files('source')

        const pathChapter = Application.publicPath(`manga/${manga.id}/chapter/${chapter.number}`)
        for(const source of sources) {
            await source.move(pathChapter)
        }

        chapter.source = JSON.stringify(sources.map(source => source.clientName))
        await chapter.save()

        return response.created({
            message: 'Thêm chapter thành công',
            data: chapter,
        })
    }

    public async detail({request, response}: HttpContextContract) {
        
    }
}
