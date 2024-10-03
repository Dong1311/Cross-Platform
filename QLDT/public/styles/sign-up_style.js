import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#b71c1c',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    logo: {
      width: 170,
      height: 170,
      marginBottom: 20,
      resizeMode: 'contain',
    },
    title: {
      fontSize: 24,
      color: 'white',
      marginBottom: 20,
    },
    form: {
      width: '100%',
    },
    input: {
      backgroundColor: 'white',
      padding: 12,
      borderRadius: 5,
      marginBottom: 10,
      fontSize: 16,
    },
    nameContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfInput: {
      width: '48%',
    },
    button: {
      backgroundColor: '#fff',
      padding: 15,
      borderRadius: 30,
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#b71c1c',
      fontSize: 18,
      fontWeight: 'bold',
    },
    loginText: {
      color: 'white',
      fontSize: 14,
      textAlign: 'center',
      marginTop: 10,
      textDecorationLine: 'underline',
    },
    errorText: {
      color: 'red',
      fontSize: 12,
      marginBottom: 10,
    },
    errorInput: {
      borderColor: 'red',
      borderWidth: 1,
    },
  });
  
  export default styles;
