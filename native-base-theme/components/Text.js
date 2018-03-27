import variable from "./../variables/platform";

export default (variables = variable) => {
  const textTheme = {
    fontSize: variables.fontSizeBase,
    fontFamily: variables.fontFamily,
    color: variables.textColor,
    ".note": {
      color: "#a7a7a7",
      fontSize: variables.noteFontSize
    },
    ".xlarge": {
      fontSize: 35,
      marginBottom: 5,
      fontWeight: "800"
    },
    ".large": {
      fontSize: 25,
      marginBottom: 5,
      fontWeight: "800"
    },
    ".medium": {
      fontSize: 20,
      marginBottom: 5,
      fontWeight: "800"
    },
    ".medium-thin": {
      fontSize: 20,
      marginBottom: 5,
    },
    ".normal": {
      fontSize: 16,
      marginBottom: 5,
      fontWeight: "800"
    },
    ".small": {
      fontSize: 14,
      marginBottom: 5,
      fontWeight: "800",
    },
    ".micro": {
      fontSize: 12,
      marginBottom: 3,
    },
    ".yellow": {
      color: '#F9D764',
    },
    ".thin": {
      fontWeight: "200"
    },
    ".primary": {
      color: variables.primaryColor,
    },
    ".grey": {
      color: "#a7a7a7",
    },
    ".black": {
      color: '#000000',
    },
  };

  return textTheme;
};
