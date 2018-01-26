import variable from "./../variables/platform";

export default (variables = variable) => {
  const platform = variables.platform;

  const contentTheme = {
    ".padder": {
      padding: variables.contentPadding
    },
    ".noHeader": {
      paddingTop: (platform === "ios" ? (variables.isIphoneX ? 39 : 15) : 0) + variables.toolbarHeight,
    },
    flex: 1,
    backgroundColor: "#ffffff",
    "NativeBase.Segment": {
      borderWidth: 0,
      backgroundColor: "transparent"
    }
  };

  return contentTheme;
};
