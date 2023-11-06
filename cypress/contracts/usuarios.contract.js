const joi = require ('joi')

const usuariosSchema = joi.object({
  quantidade: joi.number(),
  usuarios: joi.array().items({
  nome: joi.string(),
  email: joi.string(),
  password: joi.string(),
  administrador: joi.string(),
  _id: joi.string()


  })

})    

export default usuariosSchema;