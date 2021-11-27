import React, { } from 'react'
import { Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles/styles'
import EditNote from './EditNote'

const ViewNote = ({ navigation, route }) => {
    // console.log(route)

    return (
        <View style={styles.container}>
            <View style={{ padding: 20, paddingTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}><Icon name='ios-return-down-back' color='#fff' size={30} /></TouchableOpacity>
                    <View style={{ width: 20, height: 20 }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>Read note</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('EditNote', { noteData: route.params.noteData })}>
                    <Icon name='text-outline' size={25} color='#fff' />
                </TouchableOpacity>

                {/* <View style={{ flexDirection: 'row', alignItems: 'center', width: '30%', justifyContent: 'space-between' }}>
                    <Icon name='text-outline' size={25} color='#fff' />
                    <Icon name='ios-close' size={25} color='#fff' />
                </View> */}
            </View >

            <ScrollView style={{ padding: 20, backgroundColor: '#fff' }}>
                <Text style={{ fontSize: 50 }}>{route.params.noteData.mood}</Text>
                <View style={{ height: 20, width: 20 }} />
                <Text>{route.params.noteData.date} at {route.params.noteData.time}</Text>
                <View style={{ height: 20, width: 20 }} />

                <Text style={{ fontSize: 18, lineHeight: 30, paddingBottom: 100 }} >{route.params.noteData.content}</Text>
            </ScrollView>
        </View >
    );
}

export default ViewNote