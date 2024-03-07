import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TabBarStatus = {
  focused: boolean;
  color: string;
  size: number;
};

export type TabParamList = {
  MapTab: undefined;
  AlertsTab: undefined;
  ReportTab: undefined;
  SavedTab: undefined;
  // add more tab params...
};

export type TabProps = BottomTabScreenProps<TabParamList, keyof TabParamList>;
