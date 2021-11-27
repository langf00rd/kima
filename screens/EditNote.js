import React, { useState } from 'react'
import { Text, View, StatusBar, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import styles from '../styles/styles'
import storage from '../storage/storage'
// import { ViewNote } from './ViewNote'

const EditNote = ({ navigation, route }) => {
    console.log('---->', route)

    const [content, setContent] = useState(route.params.noteData.content)
    const [mood, setMood] = useState(route.params.noteData.mood)

    // let routeDate = route.params.noteData.date
    // let routeContent = route.params.noteData.content
    // let routeNoteId = route.params.noteData.noteId
    // let routeTime = route.params.noteData.time
    // let routeMood = route.params.noteData.mood

    const saveNote = async () => {

        await storage.load({ key: 'notes' })
            .then(async (data) => {

                Alert.alert('', 'Do you want to save your changes?', [
                    { text: "Cancel", onPress: () => { } },

                    {
                        text: "Yes", onPress: async () => {
                            let p = []

                            for (let i = 0; i < data.length; i++) {
                                p.push(data[i])
                            }

                            for (let i = 0; i < p.length; i++) {
                                const element = data[i];

                                if (element.noteId === route.params.noteData.noteId) {
                                    console.log(element.noteId)
                                    p.splice(i, 1);

                                    route.params.noteData.content = content
                                    route.params.noteData.mood = mood
                                    console.log('---->', route.params.noteData)

                                    p.push(route.params.noteData)
                                }
                            }

                            await storage.save({ key: 'notes', data: p })
                        }
                    },
                ])



                // p.reverse()
                // console.log(p)

                // setAllNotes(p)

            })
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#797cd2' barStyle="light-content" />

            <View style={{ padding: 20, paddingTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('ViewNote', { noteData: route.params.noteData }) }}>
                        <Icon name='ios-return-down-back' color='#fff' size={30} />
                    </TouchableOpacity>
                    <View style={{ width: 20, height: 20 }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>Edit note</Text>
                </View>

                <TouchableOpacity onPress={() => saveNote()} style={{ backgroundColor: '#FF6666', paddingHorizontal: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center', paddingVertical: 10, }}>SAVE</Text>
                    <Icon name='ios-checkmark-outline' size={20} color='#fff' />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ padding: 20, backgroundColor: '#fff' }}>
                <Text>{route.params.noteData.date} at {route.params.noteData.time}</Text>
                <View style={{ width: 20, height: 20 }} />
                <TextInput
                    value={mood}
                    onChangeText={(val) => setMood(val)}
                    autoFocus={true}
                    multiline={true}
                    style={{ fontSize: 50 }}
                    placeholder='Your mood.'
                />

                <View style={{ width: 20, height: 20 }} />
                <TextInput
                    value={content}
                    onChangeText={(val) => setContent(val)}
                    autoFocus={true}
                    multiline={true}
                    style={{ paddingVertical: 10, fontSize: 18, lineHeight: 30, paddingBottom: 100 }}
                    placeholder='Write your content here...'
                />

            </ScrollView>
        </View>
    )
}

export default EditNote