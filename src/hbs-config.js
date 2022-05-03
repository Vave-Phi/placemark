import Handlebars from "handlebars";

export default () => {
  Handlebars.registerHelper("select", function (selected, options) {
    return options.fn(this).replace(new RegExp(` value="${selected}"`), '$& selected="selected"');
  });
};
