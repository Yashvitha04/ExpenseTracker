import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class AuthValidator {
  public static authSchema = schema.create({
    username: schema.string.optional({}, [
      rules.minLength(3),
      rules.maxLength(255),
    ]),
    email: schema.string({}, [
      rules.email(),
      rules.maxLength(255),
    ]),
    password: schema.string({}, [
      rules.minLength(6),
      rules.regex(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/), 
    ]),
  })

  public static messages = {
    'username.required': 'Username is required',
    'username.minLength': 'Username should be at least 3 characters long',
    'email.required': 'Email is required',
    'email.email': 'Email must be a valid email address',
    'password.required': 'Password is required',
    'password.minLength': 'Password should be at least 6 characters long',
    'password.regex': 'Password must contain at least one letter, one number, and one special character',
  }
}
