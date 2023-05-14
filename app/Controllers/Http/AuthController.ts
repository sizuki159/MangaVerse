import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'


export default class AuthController {
    // [POST]
    public async register ({request, response, auth}: HttpContextContract) {
        const {email, password, fullname} = request.body()

        const userOld = await User.findBy('email', email)
        if(userOld) {
            return response.badRequest({
                message: 'Email đã được sử dụng',
                data: null,
            })
        }

        let newUser = await User.create({
            email,
            password,
            fullname,
        })
        const token = await auth.use('api').generate(newUser)

        newUser = await User.findOrFail(newUser.id)
        return response.status(201).json({
            message: 'Đăng ký thành công!',
            data: {
                token: token,
                user: newUser,
            }
        })
    }

    // [POST]
    public async login({request, response, auth} : HttpContextContract) {
        const {email, password} = request.body()
        try {
            const token = await auth.use('api').attempt(email, password)
            const user = await User.findByOrFail('email', email)

            if(user.status === User.STATUS.DISABLED) {
                return response.unauthorized({
                    message: "Tài khoản của bạn đã bị khóa!",
                    data: null
                })
            }
            return response.status(200).json({
                message: "Đăng nhập thành công!",
                data: {
                    token: token,
                    user
                }
            })
        } catch(ex) {
            return response.unauthorized({
                message: "Sai tài khoản hoặc mật khẩu!",
                data: null
            })
        }
    }
}
