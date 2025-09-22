module.exports = {
    assets: ['./src/assets/fonts'], // only your custom fonts
    dependencies: {
      'react-native-vector-icons': {
        platforms: {
          ios: null, // prevent double linking on iOS
        },
      },
    },
  };
  