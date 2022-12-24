import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors"

const productSchema = {
    name: {
        in: ['body'],
        isString: {
            errorMassage:'Name is a mandatory field and needs to be a string!',
        },
    },
    description: {
        in: ['body'],
        isString: {
            errorMassage:'Description is a mandatory field and needs to be a string!',
        },
    },
    brand: {
        in: ['body'],
        isString: {
            errorMassage:'Brand is a mandatory field and needs to be a string!',
        },
    },
    price: {
        in: ['body'],
        isNumeric: {
            errorMassage:'Price is a mandatory field and needs to be a number!',
        },
    },
    category: {
        in: ['body'],
        isString: {
            errorMassage:'Category is a mandatory field and needs to be a string!',
        },
    },


};

export const checkProductSchema = checkSchema(productSchema);

export const triggerBadRequest = (req, res, next) => {
    const errors = validationResult(req);
    console.log('errors:-', errors.array());
  if (!errors.isEmpty()) {
    next(createHttpError(400, "Errors during product validation", { errorsList: errors.array() }))
  } else {
    next()
  }
    
}