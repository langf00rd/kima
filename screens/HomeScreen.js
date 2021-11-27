import React, { useEffect, useState, createRef } from 'react';
import { StatusBar, Platform, ScrollView, Vibration, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from "react-native-actions-sheet";
import storage from '../storage/storage'
import styles from '../styles/styles';

const HomeScreen = ({ navigation }) => {

    // storage.remove({ key: 'originalPassword' })
    // storage.remove({ key: 'password' })
    // storage.save({ key: 'notes', data: [] })

    const date = Date().substr(0, 15)
    const time = Date().substr(16, 5)

    const [bgColor, setColor] = useState('#797cd2')

    const [currentMood, setCurrentMood] = useState('🌻')
    const [text, setText] = useState('')

    const [originalPassword, setOriginalPassword] = useState('')
    const [password, setPassword] = useState('')

    const addActionRef = createRef()
    const setPasswordActionRef = createRef()
    const passwordActionRef = createRef()

    const [sheetClosable, setSheetClosable] = useState(false)
    const [passwordSheetClosable, setPasswordSheetClosable] = useState(false)

    const [newPswdSet, setNewPswdSet] = useState(false)
    const [pswdSet, setPswdSet] = useState(false)

    useEffect(async () => {
        try {

            await storage.load({ key: 'originalPassword' })
                .then(code => {
                    setOriginalPassword(code)
                    passwordActionRef.current?.setModalVisible()
                })
        }
        catch (e) { setPasswordActionRef.current?.setModalVisible() }

    }, [originalPassword, password])

    const selectMood = (emoji) => {

        Vibration.vibrate(50, false)

        switch (emoji) {
            case '😁':
                setColor('#00B8F6')
                break;
            case '😕':
                setColor('#797cd2')
                break;
            case '😠':
                setColor('#C22727')
                break;
            case '😭':
                setColor('#5B5AD4')
                break;
            case '😔':
                setColor('#2A6AB5')
                break;

            default:
                break;
        }

        setCurrentMood(emoji)
    }

    const saveNote = async () => {
        // if (currentMood === null) { alert('Please select your current mood'); return }
        if (text.trim() === '') { alert('Please add a note'); return }

        const newNote = {
            'time': time,
            'date': date,
            'content': text,
            'mood': currentMood,
            'noteId': Date.now()
        }

        const oldNotes = await storage.load({ key: 'notes' }).catch(e => { })
        let newNotes = [...oldNotes, newNote]
        setText('')
        await storage.save({ key: 'notes', data: newNotes })

        Alert.alert('Saved', 'Your note was saved')
    }

    const currentMoodUI = () => {
        return <View style={{ padding: 10 }}>
            <Text style={{ textAlign: 'center', fontSize: 130 }}>{currentMood}</Text>
        </View>
    }

    const closePasswordActionRef = () => { setPasswordSheetClosable(true); passwordActionRef.current?.setModalVisible(false) }
    const closeSetPasswordActionRef = () => { setSheetClosable(true); setPasswordActionRef.current?.setModalVisible(false) }

    const setPswd = async () => {
        const pswd = originalPassword.toLowerCase().trim().split(/\s+/).join("")
        console.log(pswd)

        if (pswd.trim() != '') {
            await storage.save({ key: 'originalPassword', data: pswd });
            await storage.save({ key: 'notes', data: [] })

            closeSetPasswordActionRef()
            setNewPswdSet(true)
            return
        }

        Vibration.vibrate(50, false);
        alert('Please enter a password')
    }

    const checkPswd = async () => {
        const pswd = password.toLowerCase().trim().split(/\s+/).join("")

        if (pswd === originalPassword) {
            closePasswordActionRef()
            setPswdSet(true)
            return
        }

        Vibration.vibrate(70, false);
        alert('You entered the wrong password')
    }

    const setPswdUI = () => {
        if (!newPswdSet) return <ScrollView style={styles.sheetScrollView}>
            <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#fff', textAlign: 'center' }}>
                <Icon name='ios-key-sharp' size={27} />
                <View style={styles.space10} />
                Set a password
            </Text>
            <View style={styles.space10} />
            <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 20 }}>This password will be required anytime you open the app. This makes your notes stay private</Text>

            <View style={styles.space30} />
            <TextInput
                value={originalPassword}
                onChangeText={(val) => setOriginalPassword(val)}
                keyboardType={'default'}
                style={styles.pswdInput}
                placeholder='Enter a new password'
                placeholderTextColor='#f1f1f155'
            />
            <View style={{ width: 30, height: 30 }} />

            <TouchableOpacity style={{ backgroundColor: '#FF6666', padding: 20, borderRadius: 10 }} onPress={() => { setPswd() }}>
                <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Done</Text>
            </TouchableOpacity>
        </ScrollView>

        else return <View style={{ paddingBottom: 40 }}>
            <View style={styles.space20} />
            <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#fff', textAlign: 'center' }}> Your password is set  </Text>
            <View style={styles.space20} />
            <TouchableOpacity style={{ backgroundColor: '#FF6666', padding: 20, borderRadius: 10 }} onPress={() => { closeSetPasswordActionRef() }}>
                <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Awesome</Text>
            </TouchableOpacity>
        </View>
    }

    const checkPswdUI = () => {
        if (!pswdSet) return <ScrollView style={styles.sheetScrollView}>
            <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#fff', textAlign: 'center' }}>
                <Icon name='ios-key-sharp' size={27} />
                <View style={styles.space10} />
                Enter your password
            </Text>

            <View style={styles.space30} />
            <TextInput
                value={password}
                onChangeText={(val) => setPassword(val)}
                style={styles.pswdInput}
                placeholder="password"
                placeholderTextColor='#f1f1f155'
            />
            <View style={{ width: 30, height: 30 }} />

            <TouchableOpacity style={{ backgroundColor: '#FF6666', padding: 20, borderRadius: 10 }} onPress={() => { checkPswd() }}>
                <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Done</Text>
            </TouchableOpacity>
        </ScrollView>

        else return <View style={{ paddingBottom: 40 }}>
            <View style={styles.space20} />
            <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#fff', textAlign: 'center' }}> Welcome back  </Text>
            <View style={styles.space20} />
            <TouchableOpacity style={{ backgroundColor: '#FF6666', padding: 20, borderRadius: 10 }} onPress={() => { closePasswordActionRef() }}>
                <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Okay</Text>
            </TouchableOpacity>
        </View>
    }

    return (
        <View style={{
            flex: 1,
            backgroundColor: bgColor,
            paddingTop: Platform.OS === 'ios' ? 80 : 20
        }}>
            <StatusBar backgroundColor={bgColor} barStyle="light-content" />

            <View style={{ paddingHorizontal: 20, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#f1f1f111' }}>
                <Text style={{ fontSize: 23, color: '#fff', fontWeight: 'bold' }}>Mooody</Text>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Notes')}
                    style={{
                        backgroundColor: '#FF6666', paddingHorizontal: 10, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 13
                    }}>
                    <Icon name='ios-pencil-sharp' color='#fff' size={20} />
                    <View style={{ width: 5, height: 5 }} />
                    <Text style={{ color: '#fff' }}>My notes</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={{ backgroundColor: '#ffffffdd', backgroundColor: '#fffffffdd', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                {currentMoodUI()}

                <View style={{ width: 20, height: 20 }} />

                <Text style={{ fontSize: 21, textAlign: 'center', color: '#fff' }}>
                    Hey, how are you feeling?
                </Text>

                <View style={{ width: 20, height: 20 }} />

                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => selectMood('😁')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😁</Text>
                        <Text style={{ color: '#fff' }}>Happy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => selectMood('😕')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😕</Text>
                        <Text style={{ color: '#fff' }}>Meh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => selectMood('😠')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😠</Text>
                        <Text style={{ color: '#fff' }}>Angry</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => selectMood('😔')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😔</Text>
                        <Text style={{ color: '#fff' }}>Sad</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>

            <TouchableOpacity style={{ backgroundColor: '#FF6666', padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }} onPress={() => addActionRef.current?.setModalVisible()}>
                <Icon name='ios-add-sharp' size={30} color='#fff' />
                <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Add a note...</Text>
            </TouchableOpacity>

            <ActionSheet
                gestureEnabled={true}
                defaultOverlayOpacity={0.4}
                elevation={0}
                ref={passwordActionRef}
                closable={passwordSheetClosable}
                containerStyle={styles.sheetContainer}>

                {checkPswdUI()}
            </ActionSheet>

            <ActionSheet
                gestureEnabled={true}
                defaultOverlayOpacity={0.4}
                elevation={0}
                ref={setPasswordActionRef}
                closable={sheetClosable}
                containerStyle={styles.sheetContainer}>

                {setPswdUI()}
            </ActionSheet>

            <ActionSheet
                gestureEnabled={true}
                defaultOverlayOpacity={0.05}
                elevation={0}
                keyboardType={'default'}
                ref={addActionRef}
                containerStyle={{}}>

                <ScrollView style={[styles.sheetContainer, { height: Dimensions.get('window').height, backgroundColor: '#fff' }]}>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#f1f1f111' }}>
                        <Text style={{ fontSize: 25 }}>Add a note</Text>

                        <TouchableOpacity onPress={() => saveNote()} style={{ backgroundColor: '#FF6666', paddingHorizontal: 20, borderRadius: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center', paddingVertical: 10, }}>SAVE</Text>
                            <Icon name='ios-checkmark-outline' size={20} color='#fff' />
                        </TouchableOpacity>
                    </View>

                    <View style={{ height: 30, width: 30 }} />

                    <KeyboardAvoidingView>
                        <TextInput
                            value={text}
                            onChangeText={(val) => setText(val)}
                            style={{ width: '100%', borderRadius: 13, lineHeight: 30, fontSize: 19, height: 340, marginBottom: 90 }}
                            multiline={true}
                            autoFocus={true}
                            placeholder='write here...' />
                    </KeyboardAvoidingView>
                </ScrollView>

            </ActionSheet>
        </View >
    );
}

export default HomeScreen