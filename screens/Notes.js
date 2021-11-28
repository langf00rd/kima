import React, { useState, useEffect } from 'react'
import { Alert, Dimensions, StatusBar, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Entypo'
import storage from '../storage/storage'
import styles from '../styles/styles'

const Notes = ({ navigation }) => {
    const [allNotes, setAllNotes] = useState([])
    const [hasNotes, setHasNotes] = useState(true)

    useEffect(async () => {

        try {

            await storage.load({ key: 'notes' })
                .then(data => {

                    let p = []

                    for (let i = 0; i < data.length; i++) {
                        const element = data[i];
                        p.push(element)
                    }

                    if (data.length > 0) setHasNotes(true)
                    else setHasNotes(false)

                    p.reverse()
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
                <Text style={{ fontWeight: 'bold', color: '#fff', textDecorationLine: 'underline' }}>Clear all</Text>
            </TouchableOpacity>
    }

    return (
        <View style={styles.container}>

            <StatusBar backgroundColor='#797cd2' barStyle="light-content" />

            <View style={{ padding: 20, paddingTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name='chevron-thin-left' color='#fff' size={26} />
                    </TouchableOpacity>
                    <View style={styles.space10} />
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>My notes</Text>
                </View>

                {clearAllNotesUI()}
            </View>

            <ScrollView style={{ padding: 10, paddingBottom: 100, backgroundColor: '#fff' }}>
                {hasNotesUI()}
                {
                    allNotes.map((note, index) => {
                        return <View key={index}>{noteItem(note.date, note.time, note.mood, note.content, note.noteId, note.title, navigation)}</View>
                    })
                }
            </ScrollView>
        </View>
    )
}

const noteItem = (date, time, mood, content, noteId, title, navigation) => {

    const removeNote = async (id) => {
        const allNotes = await storage.load({ key: 'notes' })

        Alert.alert('', 'Are you sure you want to delete this note?', [
            { text: "Cancel", onPress: () => { } },

            {
                text: "Yes", onPress: async () => {
                    for (var i = allNotes.length - 1; i >= 0; i--) {
                        if (allNotes[i].noteId === id) {
                            allNotes.splice(i, 1);
                        }
                    }
                    await storage.save({ key: 'notes', data: allNotes })
                }
            },
        ])
    }

    return <TouchableOpacity
        activeOpacity={0.2}
        onPress={() => navigation.navigate('ViewNote', { noteData: { date, time, mood, content, noteId, title } })}
        style={[styles.flexTop, { padding: 10, marginBottom: 10, borderRadius: 10, paddingVertical: 20, paddingBottom: 10, borderColor: '#f1f1f1', borderWidth: 1, }]}>

        <Text style={{ fontSize: 40 }}>{mood}</Text>
        <View style={styles.space10} />


        <View style={{ width: '80%' }}>


            <Text style={{ fontWeight: 'bold' }}>{title}</Text>
            <View style={styles.space10} />

            <View style={{ width: '100%' }}><Text numberOfLines={5} style={{ lineHeight: 20 }} >{content}</Text></View>
            <View style={styles.space10} />

            <View style={styles.flexBetween}>
                <Text style={{ color: '#24242488' }}>{date} - {time}</Text>
                <TouchableOpacity onPress={() => removeNote(noteId)}><Text style={{ color: '#FF6666', fontWeight: 'bold' }}>DELETE</Text></TouchableOpacity>
            </View>
        </View>

    </TouchableOpacity>
}

export default Notes;