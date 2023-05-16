import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Manga from 'App/Models/Manga'
import Application from '@ioc:Adonis/Core/Application'
import Category from 'App/Models/Category'
import Env from '@ioc:Adonis/Core/Env'
import Chapter from 'App/Models/Chapter'

export default class MangaController {
    public async all({request, response}: HttpContextContract) {
        const mangas = await Manga.all()
        const data = mangas.map(manga => {
            manga.image = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${manga.id}/${manga.image}`
            return manga
        })
        return response.json(data)
    }

    public async getAllcomment({request, response, params}: HttpContextContract) {
        const manga = await Manga.findOrFail(params.mangaId)
        await manga.load('comments', comments => comments.preload('user'))
        return response.json(manga.comments)
    }

    public async store({request, response}: HttpContextContract) {

        const categories = await Category.all()
        if(categories.length < 5) {
            return response.serviceUnavailable({
                message: 'Vui lòng thêm ít nhất 5 category trước!',
                data: null,
            })
        }

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

        await manga.related('categories').attach(this.getRandomPeople(categories, 2, 4).map(category => category.id))
        return response.created({
            message: 'Thêm manga thành công',
            data: manga,
        })
    }

    public async detail({response, params}: HttpContextContract) {
        const manga = await Manga.findOrFail(params.mangaId)
        await manga.load('author')
        await manga.load('categories')
        await manga.load('chapters')
        await manga.load('reviews')
        await manga.load('follower')
        await manga.load('comments')
        manga.image = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${manga.id}/${manga.image}`
        const chapters = manga.chapters
        for(let i = 0; i < chapters.length; i++) {
            const sourceArr = JSON.parse(chapters[i].source)
            for(let j = 0; j < sourceArr.length; j++) {
                sourceArr[j] = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${manga.id}/chapter/${chapters[i].number}/${sourceArr[j]}`
            }
            manga.chapters[i].source = JSON.stringify(sourceArr)
        }
        
        return response.json(manga)
    }

    public async allChapterOfManga({response, params}: HttpContextContract) {
        const manga = await Manga.findOrFail(params.mangaId)
        await manga.load('chapters')
        
        return response.json(manga.chapters)
    }

    public async chapterDetailByChapterNumberAndMangaId({response, params}: HttpContextContract) {
        const mangaId = params.mangaId
        const chapterNumber = params.chapterNumber

        const chapterInfo = await Chapter.query().where('number', chapterNumber).where('mangaId', mangaId).first();
        if(!chapterInfo) return response.noContent();
        
        await chapterInfo.load('manga')
        chapterInfo.manga.image = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${chapterInfo.manga.id}/${chapterInfo.manga.image}`
        const sourceArr = JSON.parse(chapterInfo.source)
        for(let i = 0; i < sourceArr.length; i++) {
            sourceArr[i] = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${chapterInfo.manga.id}/chapter/${chapterInfo.number}/${sourceArr[i]}`
        }
        chapterInfo.source = JSON.stringify(sourceArr)

        return response.json(chapterInfo);
    }

    private getRandomPeople(people: Category[], min: number, max: number): Category[] {
        const count = Math.floor(Math.random() * (max - min + 1) + min); // số lượng người ngẫu nhiên từ min đến max
        const result: Category[] = [];
        const arr = [...people];
      
        while (result.length < count) {
          const index = Math.floor(Math.random() * arr.length); // chỉ số của phần tử ngẫu nhiên
          const person = arr.splice(index, 1)[0]; // loại bỏ phần tử đã chọn khỏi mảng và lấy ra phần tử đó
          result.push(person);
        }
      
        return result;
    }

}
