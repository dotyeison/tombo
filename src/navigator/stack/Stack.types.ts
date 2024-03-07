import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type StackParamList = {
  MapStack: undefined;
  AlertsStack: undefined;
  ReportsStack: undefined;
  DetailsStack: { from: string };
  // add more screen props...
};

export type StackProps = NativeStackScreenProps<StackParamList, keyof StackParamList>;
