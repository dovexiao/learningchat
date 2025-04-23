import {Alert} from 'react-native';

export const errAlert = (error: any) => {
    let errorMessage = error?.message;
    if (error?.response) {
        errorMessage += `\n${error.response.data.message}`;
    }
    console.log(error);
    Alert.alert('Error', errorMessage);
};
