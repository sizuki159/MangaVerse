import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Manga from 'App/Models/Manga'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import Chapter from 'App/Models/Chapter'

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

    public async chapterDetailByChapterId({request, response, params}: HttpContextContract) {
        const chapterInfo = await Chapter.findOrFail(params.chapterId);
        await chapterInfo.load('manga')

        chapterInfo.manga.image = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${chapterInfo.manga.id}/${chapterInfo.manga.image}`
        const sourceArr = JSON.parse(chapterInfo.source)
        for(let i = 0; i < sourceArr.length; i++) {
            sourceArr[i] = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${chapterInfo.manga.id}/chapter/${chapterInfo.number}/${sourceArr[i]}`
        }
        chapterInfo.source = JSON.stringify(sourceArr)
        

        return response.json(chapterInfo)
    }
}
