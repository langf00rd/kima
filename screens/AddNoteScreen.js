import React, { useEffect, useState } from 'react';
import { StatusBar, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import storage from '../storage/storage'
import styles from '../styles/styles';


const AddNoteScreen = ({ navigation }) => {
    const [title, setTitle] = useState('')
    const [text, setText] = useState('')

    const date = Date().substr(0, 15)
    const time = Date().substr(16, 5)

    const [currentMood, setCurrentMood] = useState('💎')
    const [currentMoodName, setCurrentMoodName] = useState('Normal')

    useEffect(async () => {
        await storage.load({ key: 'currentMood' }).then(data => {
            setCurrentMood(data.emoji)
            setCurrentMoodName(data.emojiName)

        }).catch(e => { })
    }, [currentMood, currentMoodName])

    const saveNote = async () => {
        if (text.trim() === '') { alert('Please add a note'); return }

        setText(text.trim())

        const timestamp = Date.now()
        const newNote = {
            'time': time,
            'date': date,
            'title': title,
            'content': text.trim(),
            'mood': currentMood,
            'noteId': timestamp
        }

        const oldNotes = await storage.load({ key: 'notes' }).catch(e => { })
        let newNotes = [...oldNotes, newNote]
        setText('')
        setTitle('')
        await storage.save({ key: 'notes', data: newNotes })

        navigation.navigate('ViewNote', { noteData: ({ 'date': date, 'time': time, 'mood': currentMood, 'content': text, 'noteId': timestamp, 'title': title }) })
    }

    return <View style={styles.container}>
        <StatusBar backgroundColor='#797cd2' barStyle="light-content" />

        <View style={{ padding: 20, paddingTop: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}>
                    <Icon name='chevron-thin-left' color='#fff' size={30} />
                </TouchableOpacity>
                <View style={styles.space10} />
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#fff' }}>Add a note</Text>
            </View>

            <TouchableOpacity onPress={() => saveNote()} style={{ backgroundColor: '#FF6666', paddingHorizontal: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center', paddingVertical: 10, }}>SAVE</Text>
            </TouchableOpacity>
        </View>

        <ScrollView style={{ backgroundColor: '#fff', padding: 20 }}>
            <View style={styles.space20} />
            <Text>Date: {date} </Text>
            <View style={styles.space10} />
            <Text>Time: {time}</Text>
            <View style={styles.space10} />
            <Text>Tile: {title}</Text>
            <View style={styles.space10} />
            <Text>I feel {currentMoodName} {currentMood}</Text>

            <View style={{ height: 30, width: 30 }} />

            <TextInput
                value={title}
                onChangeText={(val) => setTitle(val)}
                style={{ fontSize: 21, fontWeight: 'bold' }}
                multiline={true}
                placeholder='Add a note title...' />

            <View style={styles.space20} />

            <TextInput
                value={text}
                onChangeText={(val) => setText(val)}
                style={{ width: '100%', borderRadius: 13, lineHeight: 30, fontSize: 19, paddingBottom: 50 }}
                multiline={true}
                placeholder='Write your notes here...' />
        </ScrollView>
    </View>
}

export default AddNoteScreen