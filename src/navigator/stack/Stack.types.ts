import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList = {
  MapStack: { focus: { lat: number; lon: number } };
  AlertsStack: undefined;
  ReportsStack: undefined;
  DetailsStack: undefined;
  SavedStack: undefined;
  // add more screen props...
};

export type StackProps = NativeStackScreenProps<StackParamList, keyof StackParamList>;
