import React, { } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import styles from '../styles/styles'

const ViewNote = ({ navigation, route }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.flexBetween, { padding: 20, paddingTop: 0 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='chevron-thin-left' color='#fff' size={26} />
                    </TouchableOpacity>
                    <View style={styles.space10} />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>Read note</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('EditNote', { noteData: route.params.noteData })}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', textDecorationLine: 'underline' }}>Edit note</Text>
                </TouchableOpacity>
            </View >

            <ScrollView style={{ padding: 20, backgroundColor: '#fff' }}>

                <Text style={{ fontSize: 50 }}>{route.params.noteData.mood}</Text>
                <View style={styles.space10} />
                <Text style={{ fontWeight: 'bold', fontSize: 21 }}>{route.params.noteData.title}</Text>
                <View style={styles.space10} />
                <Text style={{ color: '#24242488' }}>{route.params.noteData.date} at {route.params.noteData.time}</Text>
                <View style={styles.space30} />

                <Text style={{ fontSize: 18, lineHeight: 30, paddingBottom: 100 }} >{route.params.noteData.content}</Text>
            </ScrollView>
        </View >
    );
}

export default ViewNote