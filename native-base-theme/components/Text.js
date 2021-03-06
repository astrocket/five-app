import variable from "./../variables/platform";

export default (variables = variable) => {
  const textTheme = {
    fontSize: variables.fontSizeBase,
    fontFamily: variables.fontFamily,
    color: variables.textColor,
    ".note": {
      color: "#a7a7a7",
      marginTop: 1,
      marginBottom: 4,
      fontSize: variables.noteFontSize
    },
    ".xlarge": {
      fontSize: 34,
      marginBottom: 3,
      fontWeight: "800"
    },
    ".large": {
      fontSize: 24,
      marginBottom: 3,
      fontWeight: "800"
    },
    ".medium": {
      fontSize: 20,
      marginBottom: 3,
      fontWeight: "800"
    },
    ".medium-thin": {
      fontSize: 20,
      marginBottom: 3,
    },
    ".normal": {
      fontSize: 17,
      marginBottom: 3,
    },
    ".normal-thin": {
      fontSize: 17,
      marginBottom: 4,
      fontWeight: "800"
    },
    ".small": {
      fontSize: 14,
      marginBottom: 2,
      fontWeight: "800",
    },
    ".micro": {
      fontSize: 12,

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
    ".sd-gothic": {
      fontFamily: "AppleSDGothicNeoEB00",
    },
    ".montserrat": {
      fontFamily: "Montserrat-ExtraBold"
    }
  };

  return textTheme;
};
