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
    name: Joi.string().example("OTH Regensburg").required(),
  })
  .label("PoiDetails");

export const PoiSpecUpdate = Joi.object()
  .keys({
    name: Joi.string().example("OTH Regensburg"),
    lat: Joi.number().example(49.01643),
    lng: Joi.number().example(12.10176),
    desc: Joi.string().example("Lorem Ipsum"),
    category: Joi.string().example("University"),
  })
  .label("PoiDetails");

export const PoiSpecDomain = PoiSpecUpdate.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("PoiDetailsDomain");
