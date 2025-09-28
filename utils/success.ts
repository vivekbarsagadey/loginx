
import { Alert } from 'react-native';

export const showSuccess = (title: string, message: string, onOk?: () => void) => {
  Alert.alert(
    title,
    message,
    [{ text: 'OK', onPress: onOk }]
  );
};
