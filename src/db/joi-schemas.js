import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserSpec = Joi.object()
  .keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserDetails");

export const UserSpecDomain = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsDomain");

export const UserCredentialsSpec = Joi.object()
  .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserCredentials");

export const UserArray = Joi.array().items(UserSpecDomain).label("UserArray");

export const PoiSpec = Joi.object()
  .keys({
    name: Joi.string().example("Big Ben").required(),
  })
  .label("PoiDetails");

export const PoiSpecUpdate = Joi.object()
  .keys({
    name: Joi.string().example("Big Ben"),
  })
  .label("PoiDetails");

export const PoiSpecDomain = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PoiDetailsDomain");
