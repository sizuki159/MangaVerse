import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import EmailValidator from 'App/Validators/EmailValidator'
import LoginValidator from 'App/Validators/LoginValidator'
import PasswordValidator from 'App/Validators/PasswordValidator'

export default class AuthController {
    // [POST]
    public async register ({request, response, auth}: HttpContextContract) {
        const {email} = await request.validate(EmailValidator)
        const {password} = await request.validate(PasswordValidator)

        const {fullname} = request.body()

        const newUser = await User.create({
            email,
            password,
            fullname,
        })
        
        return response.status(201).json({
            message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác minh!',
            data: newUser,
        })
    }

    // [POST]
    public async login({request, response, auth} : HttpContextContract) {
        const {email, password} = await request.validate(LoginValidator)
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
                    token: token
                }
            })
        } catch {
            return response.unauthorized({
                message: "Sai tài khoản hoặc mật khẩu!",
                data: null
            })
        }
    }
}
