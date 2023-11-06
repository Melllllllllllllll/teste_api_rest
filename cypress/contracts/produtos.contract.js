const joi = require ('joi')

const produtosSchema = joi.object({
     quantidade: joi.number(),
     produtos: joi.array().items({
         nome: joi.string(),
         preco: joi.number(),
         descricao: joi.string(),
         quantidade: joi.number(),
         _id: joi.string()


     })


})

export default produtosSchema;