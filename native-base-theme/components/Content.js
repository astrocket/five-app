import variable from "./../variables/platform";

export default (variables = variable) => {
  const contentTheme = {
    ".padder": {
      padding: variables.contentPadding
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
