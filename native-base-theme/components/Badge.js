import variable from "./../variables/platform";

export default (variables = variable) => {
  const badgeTheme = {
    ".primary": {
      backgroundColor: variables.btnPrimaryBg
    },
    ".warning": {
      backgroundColor: variables.btnWarningBg
    },
    ".info": {
      backgroundColor: variables.btnInfoBg
    },
    ".success": {
      backgroundColor: variables.btnSuccessBg
    },
    ".danger": {
      backgroundColor: variables.btnDangerBg
    },
    ".micro": {
      backgroundColor: variables.badgeBg,
      padding: variables.badgePadding / 1.5,
      paddingHorizontal: 4,
      alignSelf: "flex-start",
      borderRadius: 9,
      height: 18,
      "NativeBase.Text": {
        color: variables.badgeColor,
        fontSize: 8,
        lineHeight: variables.lineHeight - 7,
        textAlign: "center",
        paddingHorizontal: 1.5
      },
    },
    ".round_micro": {
      "NativeBase.Text": {
        color: variables.badgeColor,
        fontSize: variables.fontSizeBase,
        lineHeight: variables.lineHeight - 1,
        textAlign: "center",
        paddingHorizontal: 3
      },
      backgroundColor: '#858585',
      padding: variables.badgePadding,
      paddingHorizontal: 3,
      alignSelf: "flex-start",
      borderRadius: 12.5,
      height: 25
    },
    "NativeBase.Text": {
      color: variables.badgeColor,
      fontSize: variables.fontSizeBase,
      lineHeight: variables.lineHeight - 1,
      textAlign: "center",
      paddingHorizontal: 3
    },
    backgroundColor: variables.badgeBg,
    padding: variables.badgePadding,
    paddingHorizontal: 6,
    alignSelf: "flex-start",
    borderRadius: 13.5,
    height: 27
  };
  return badgeTheme;
};
