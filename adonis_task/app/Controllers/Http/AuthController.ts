import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import AuthValidator from 'App/Validators/UserValidator'

export default class AuthController {
  public async register({ auth, request, response }: HttpContextContract) {
    const validatedData = await request.validate({
      schema: AuthValidator.authSchema,
      messages: AuthValidator.messages
    })
    if (!validatedData.username) {
      return response.badRequest({ error: 'Username is required for registration' })
    }

    try {
      const user = await User.create(validatedData)
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

    const validatedData = await request.validate({
      schema: AuthValidator.authSchema,
      messages: AuthValidator.messages
    })
    if (validatedData.username) {
      return response.badRequest({ error: 'Username should not be provided for login' })
    }

    const email = validatedData.email
    const password = validatedData.password

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
