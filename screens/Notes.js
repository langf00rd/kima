import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { Alert, Dimensions, StatusBar, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import storage from '../storage/storage'
import styles from '../styles/styles'
import ViewNote from './ViewNote'

const Notes = ({ navigation }) => {
    const [allNotes, setAllNotes] = useState([])
    const [hasNotes, setHasNotes] = useState(true)

    useEffect(async () => {
        // console.log('change...')

        try {
            // await storage.remove({ key: 'notes' })
            // storage.save({ key: 'notes', data: [] })

            await storage.load({ key: 'notes' })
                .then(data => {

                    // console.log(data.length)

                    let p = []

                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        p.push(element)
                    }

                    if (data.length > 0) setHasNotes(true)
                    else setHasNotes(false)

                    p.reverse()
                    // console.log(p)

                    setAllNotes(p)

                })
        } catch (e) {

        }

        return () => { }
    }, [allNotes])

    const clearAllNotes = async () => {
        Alert.alert('', 'Are you sure you want to clear all your notes?', [
            { text: "Cancel", onPress: () => { } },

            {
                text: "Yes", onPress: async () => {
                    await storage.remove({ key: 'notes' })
                    storage.save({ key: 'notes', data: [] })
                    setAllNotes([])
                }
            },
        ])
    }

    const hasNotesUI = () => {
        if (!hasNotes)
            return <View style={{ height: Dimensions.get('window').height - 200, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: 'bold' }}>You have no notes</Text>
            </View>
    }

    const clearAllNotesUI = () => {
        if (hasNotes)
            return <TouchableOpacity onPress={() => clearAllNotes()}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Clear all</Text>
            </TouchableOpacity>
    }


    return (
        <View style={styles.container}>

            <StatusBar backgroundColor='#797cd2' barStyle="light-content" />

            <View style={{ padding: 20, paddingTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}><Icon name='ios-return-down-back' color='#fff' size={30} /></TouchableOpacity>
                    <View style={{ width: 20, height: 20 }} />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>My notes</Text>
                </View>

                {clearAllNotesUI()}
            </View>

            <ScrollView style={{ padding: 10, paddingBottom: 100, backgroundColor: '#fff' }}>
                {hasNotesUI()}
                {
                    allNotes.map((note, index) => {
                        return <View key={index}>{noteItem(note.date, note.time, note.mood, note.content, note.noteId, navigation)}</View>
                    })
                }
            </ScrollView>
        </View>
    )
}

const noteItem = (date, time, mood, content, noteId, navigation) => {

    const removeNote = async (id) => {
        const allNotes = await storage.load({ key: 'notes' })

        Alert.alert('', 'Are you sure you want to delete this note?', [
            { text: "Cancel", onPress: () => { } },

            {
                text: "Yes", onPress: async () => {
                    for (var i = allNotes.length - 1; i >= 0; i--) {
                        if (allNotes[i].noteId === id) {
                            allNotes.splice(i, 1);

                            console.log(id)
                        }
                    }
                    await storage.save({ key: 'notes', data: allNotes })
                }
            },
        ])
    }

    return <TouchableOpacity
        onPress={() => navigation.navigate('ViewNote', { noteData: { date, time, mood, content, noteId } })}
        style={{ marginBottom: 10, padding: 10, borderRadius: 10, backgroundColor: '#e7d6c859', }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 40 }}>{mood}</Text>
            <TouchableOpacity onPress={() => removeNote(noteId)}><Icon name='ios-close-outline' size={25} /></TouchableOpacity>
        </View>

        <View style={{ width: 10, height: 10 }} />

        <View>
            <Text numberOfLines={6} style={{ fontSize: 17 }}>{content}</Text>
            <View style={{ width: 10, height: 10 }} />
            <Text style={{ color: '#24242444', fontSize: 11, }}>{date} - {time}</Text>
        </View>
    </TouchableOpacity>
}

export default Notes;