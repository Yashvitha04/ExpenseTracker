import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    const data = request.only(['username', 'email', 'password'])

    try {
      const user = await User.create(data)
      const token = await auth.use('api').login(user)
      
      return response.created({ 
        token, 
        user_id: user.id 
      })
    } catch (error) {
      return response.badRequest({ error: 'Registration failed', details: error.message })
    }
  }

  public async login({ request, auth, response }: HttpContextContract) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      const token = await auth.use('api').attempt(email, password)
      const user = await User.findByOrFail('email', email)
      
      return response.ok({ 
        token, 
        user_id: user.id 
      })
    } catch (error) {
      return response.unauthorized('Invalid credentials')
    }
  }
}
