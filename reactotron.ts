import Reactotron from "reactotron-react-native";

Reactotron.configure({
  name: "Planty",
})
  .useReactNative({
    asyncStorage: false,
    networking: { ignoreUrls: /symbolicate/ },
    editor: false,
    errors: { veto: (_) => false },
    overlay: false,
    log: false,
    storybook: false,
  })
  .connect();
