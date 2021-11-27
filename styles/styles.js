import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
    moodSelector: {
        // flexDirection: 'column',
        // alignItems: 'center',
        // width: '40%',
        // paddingVertical: 10,
        // borderRadius: 25,
        // margin: 10,
        // borderWidth: 2,
        // borderColor: '#f1f1f122'

        flexDirection: 'column',
        alignItems: 'center',
        width: '40%',
        paddingVertical: 10,
        borderRadius: 25,
        margin: 5,
        borderWidth: 2,
        backgroundColor: '#f1f1f111',
        borderColor: '#f1f1f122'
    },

    space5: {
        width: 5,
        height: 5
    },

    space10: {
        width: 10,
        height: 10
    },

    space20: {
        width: 20,
        height: 20
    },

    space30: {
        width: 30,
        height: 30
    },

    container: {
        flex: 1,
        backgroundColor: '#797cd2',
        paddingTop: Platform.OS === 'ios' ? 80 : 20
    },

    sheetContainer: {
        padding: 20,
        backgroundColor: '#797cd2',
    },

    sheetScrollView: {
        height: Dimensions.get('window').height / 2,
        paddingTop: 40
    },

    flex: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    flexBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    flexTop: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },

    pswdInput: {
        borderWidth: 2,
        borderColor: '#f1f1f122',
        backgroundColor: '#ffffff11',
        color: '#fff',
        fontSize: 20,
        textAlign: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 10
    }
})

export default styles