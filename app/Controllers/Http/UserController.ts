import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment';
import Follow from 'App/Models/Follow';
import Manga from 'App/Models/Manga';
import Review from 'App/Models/Review';
import User from 'App/Models/User';
import Env from '@ioc:Adonis/Core/Env'
import Hash from '@ioc:Adonis/Core/Hash'
import Application from '@ioc:Adonis/Core/Application'
import { LocalDriver } from '@adonisjs/core/build/standalone'

export default class UserController {
    public async followManga({request, response, auth}: HttpContextContract) {
        const user = await User.findOrFail(auth.user?.id)
        const {mangaId} = request.body()

        const manga = await Manga.findOrFail(mangaId)
        
        const followBefore = await Follow.query().where('userId', user.id).where('mangaId', manga.id).first()
        if(followBefore) {
            await followBefore.delete()
            return response.ok('unfollow')
        }

        await Follow.create({
            userId: user.id,
            mangaId: manga.id,
        })
        return response.ok('follow')
    }

    public async myFollowManga({response, auth}: HttpContextContract) {
        const user = await User.findOrFail(auth.user?.id)
        
        const magaFollows = await Follow.query().where('userId', user.id).preload('manga')
        const mangas = magaFollows.map(magaFollow => {
            magaFollow.manga.image = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${magaFollow.manga.id}/${magaFollow.manga.image}`
            return magaFollow.manga
        })
        return response.json(mangas)
    }

    public async myCommentManga({response, auth}: HttpContextContract) {
        const user = await User.findOrFail(auth.user?.id)

        let myComments = await Comment.query().where('userId', user.id)

        for(const myComment of myComments) {
            await myComment.load('manga')
            myComment.manga.image = `${Env.get('DOMAIN', 'http://192.168.1.230')}/public/manga/${myComment.manga.id}/${myComment.manga.image}`
        }

        const dataResponse = myComments.map((myComment) => {
            return {
                image: myComment.manga.image,
                name: myComment.manga.name,
                content: myComment.content,
            }
        })
        return response.json(dataResponse)
    }

    public async commentManga({request, response, auth}: HttpContextContract) {
        const user = await User.findOrFail(auth.user?.id)
        const {mangaId, content} = request.body()

        const manga = await Manga.findOrFail(mangaId)
        
        const comment = await Comment.create({
            content,
            mangaId: manga.id,
            userId: user.id,
        })

        return response.created({
            message: 'Comment thành công',
            data: comment,
        })

    }

    public async reviewManga({request, response, auth}: HttpContextContract) {
        const user = await User.findOrFail(auth.user?.id)
        const {mangaId, comment, star} = request.body()

        const manga = await Manga.findOrFail(mangaId)
        
        const review = await Review.updateOrCreate({
            mangaId: manga.id,
            userId: user.id,
        }, {
            comment,
            star,
            mangaId: manga.id,
            userId: user.id,
        })

        return response.json(review)
    }


    public async updateInfo({request, response, auth}: HttpContextContract) {
        const {fullname, passwordOld, passwordNew} = request.body()
        
        const user = await User.findOrFail(auth.user?.id)
        user.fullname = fullname
        if(passwordOld.length > 0 && passwordNew.length > 0) {
            // Kiem tra pass old
            const isCorrectPasswordOld = await Hash.verify(user.password, passwordOld)
            if(isCorrectPasswordOld) {
                user.password = passwordNew
            } else {
                return response.json({
                    message: 'Sai mật khẩu cũ!',
                });
            }
        }
        await user.save()

        return response.json({
            message: 'Cập nhật thông tin thành công!'
        });
    }

    public async uploadAvatar({request, response, auth}: HttpContextContract) {
        const user = await User.findOrFail(auth.user?.id)

        const image = request.input('image')
        if(image) {
            const decodedImage = Buffer.from(image, 'base64')

            return response.json({
                message: 'thanh cong'
            });
        }
    }
}
