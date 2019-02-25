import {StyleSheet} from "react-native";
import colors from "../../shared/colors";


const styles =  StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        alignItems: "center",
        justifyContent: "space-between",
    },
    logo: {
        flex: 1,
        width: "100%",
        resizeMode: "contain",
        alignSelf: "center"
    },
    form: {
        flex: 1,
        justifyContent: "center",
        width: "80%"
    },
    titleText:{
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        color: colors.DARK_GREY,
    },
    errorText:{
        textAlign: 'center',
        color: colors.TORCH_RED,
    }

    /*container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        padding: 20,
    },

    loginLabel: {
        fontSize: 25,
        textAlign: 'center',
        margin: 20,
        // color: 'blue',
        fontWeight: 'bold',
    },

    input: {
        width: 200,
        height: 44,
        padding: 10,
        borderWidth: 1,
        borderColor: 'black',
        marginBottom: 10,
    },

    submitBtn:{
        margin: 20,
    }*/

});

module.exports = styles;