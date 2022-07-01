import Joi from "joi";

function validateEmail(email) {

    const schema = Joi.object({
        email: Joi.string().min(8).max(255).required().email(),
    });

    return schema.validate({email})

}

function validatePass(pass) { 

    const passSchema = Joi.object({
      pass: Joi.string().min(8).max(255).required()
    })
  
    return passSchema.validate({pass});
  }
  


export {
    validateEmail,
    validatePass
}
