/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


// Static file
Route.group(() => {
    Route.get('category/:categoryId/:filename', async ({ response, params }) => {
        response.download(`public/category/${params.categoryId}/${params.filename}`)
    })

    Route.get('manga/:mangaId/:filename', async ({ response, params }) => {
        response.download(`public/manga/${params.mangaId}/${params.filename}`)
    })

    Route.get('manga/:mangaId/chapter/:chapterId/:filename', async ({ response, params }) => {
        response.download(`public/manga/${params.mangaId}/chapter/${params.chapterId}/${params.filename}`)
    })
}).prefix('public')


Route.group(() => {
    Route.post('register', 'AuthController.register')
    Route.post('login', 'AuthController.login')
}).prefix('auth')

Route.group(() => {
    Route.get('', 'CategoryController.all')
    Route.post('', 'CategoryController.store')
    Route.get(':categoryId/manga', 'CategoryController.getMangaByCategoryId')
}).prefix('category')


Route.group(() => {
    Route.get('/detail/:mangaId', 'MangaController.detail')
    Route.post('/detail/:mangaId/chapter', 'ChapterController.store')
    Route.get('/detail/:mangaId/chapter', 'MangaController.allChapterOfManga')
    Route.get('/detail/:mangaId/chapter/:chapterNumber', 'MangaController.chapterDetailByChapterNumberAndMangaId')

    
    Route.get('detail/:mangaId/comment', 'MangaController.getAllcomment')

    Route.get('', 'MangaController.all')
    Route.post('', 'MangaController.store')
}).prefix('manga')

Route.group(() => {
    Route.get('detail/:chapterId', 'ChapterController.chapterDetailByChapterId')
}).prefix('chapter')


Route.group(() => {
    Route.get('manga/follow', 'UserController.myFollowManga')
    Route.get('manga/comment', 'UserController.myCommentManga')
    Route.post('manga/follow', 'UserController.followManga')
    Route.post('manga/comment', 'UserController.commentManga')
    Route.post('manga/review', 'UserController.reviewManga')

    Route.post('info', 'UserController.updateInfo')
    Route.post('uploadAvatar', 'UserController.uploadAvatar')
}).prefix('user').middleware('auth')

