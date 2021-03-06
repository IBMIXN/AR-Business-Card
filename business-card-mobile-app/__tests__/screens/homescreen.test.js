import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { render } from "@testing-library/react-native";
import * as React from "react";
import HomeScreen from "../../screens/homescreen";
import renderer from "react-test-renderer";
import DefaultPreference from "react-native-default-preference";

// Mocking third party native libraries
jest.mock("react-native-video", () => "Video");
jest.mock("react-native-default-preference", () => {
  return {
    get: jest.fn().mockImplementation(() => Promise.resolve(true)),
  };
});

const Stack = createStackNavigator();

describe("<Homescreen />", () => {
  test("renders correctly ", async () => {
    const component = (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );

    const tree = renderer.create(component).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
