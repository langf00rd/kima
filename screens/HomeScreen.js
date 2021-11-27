import React, { useEffect, useState, createRef } from 'react';
import { StatusBar, Platform, ScrollView, Dimensions, Vibration, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from "react-native-actions-sheet";
import storage from '../storage/storage'
import styles from '../styles/styles';

const HomeScreen = ({ navigation }) => {

    const [currentMood, setCurrentMood] = useState('💎')
    const [bgColor, setColor] = useState('#797cd2')

    const [originalPassword, setOriginalPassword] = useState('')
    const [password, setPassword] = useState('')
    const [pswdHint, setPswdHint] = useState('')

    // const addActionRef = createRef()
    const setPasswordActionRef = createRef()
    const passwordActionRef = createRef()

    const [sheetClosable, setSheetClosable] = useState(false)
    const [passwordSheetClosable, setPasswordSheetClosable] = useState(false)

    const [newPswdSet, setNewPswdSet] = useState(false)
    const [pswdSet, setPswdSet] = useState(false)

    useEffect(async () => {
        try {
            await storage.load({ key: 'originalPassword' })
                .then(async (code) => {
                    setOriginalPassword(code)
                    passwordActionRef.current?.setModalVisible()

                    await storage.load({ key: 'pswdHint' }).then(hint => {
                        console.log(hint)
                        setPswdHint(hint)
                    })

                    passwordActionRef.current?.setModalVisible()

                })
        }
        catch (e) { setPasswordActionRef.current?.setModalVisible() }

    }, [originalPassword, password])

    const resetApp = () => {

        Alert.alert('', "This will reset the app's data including your notes and password. This action cannot be reversed. Are you sure you want to continue?", [
            { text: "Cancel", onPress: () => { } },
            {
                text: "Yes", onPress: () => {
                    if (password.trim() !== '') {
                        storage.remove({ key: 'originalPassword' })
                        storage.remove({ key: 'password' })
                        storage.remove({ key: 'currentMood' })
                        storage.remove({ key: 'pswdHint' })
                        storage.save({ key: 'notes', data: [] })

                        lockApp()
                        return
                    }

                    Alert.alert('', "Enter your password and tap the 'want to clear app...' to proceed to clearing the app's data")
                }
            },
        ])
    }

    const lockApp = () => {
        setOriginalPassword('')
        setPassword('')
        setSheetClosable(false)
        setPasswordSheetClosable(false)
        setNewPswdSet(false)
        setPswdSet(false)

        Vibration.vibrate(50, false)
    }

    const selectMood = async (emoji, emojiName) => {

        Vibration.vibrate(50, false)

        switch (emoji) {
            case '😁':
                setColor('#3A84C9')
                // setColor('#00B8F6')
                break;
            case '😕':
                setColor('#797cd2')
                break;
            case '😠':
                setColor('#E7504C')
                // setColor('#C22727')
                break;
            case '😭':
                setColor('#5B5AD4')
                break;
            case '😔':
                setColor('#2A6AB5')
                break;
            // 
            case '😨':
                setColor('#242424')
                break;
            case '😱':
                setColor('#ED8327')
                // setColor('purple')
                break;
            case '🤢':
                setColor('#24550E')
                break;

            default:
                break;
        }

        await storage.save({ key: 'currentMood', data: ({ 'emoji': emoji, 'emojiName': emojiName }) }).catch(e => { })
        setCurrentMood(emoji)
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
            await storage.save({ key: 'pswdHint', data: `Hint: ${pswdHint}` });
            await storage.save({ key: 'notes', data: [] })
            await storage.save({ key: 'currentMood', data: ({ 'emoji': '💎', 'emojiName': 'Normal' }) })

            closeSetPasswordActionRef()
            setNewPswdSet(true)
            return
        }

        Vibration.vibrate(50, false);
        Alert.alert('', 'Please enter a password')
    }

    const checkPswd = async () => {
        const pswd = password.toLowerCase().trim().split(/\s+/).join("")

        if (pswd === originalPassword) {
            closePasswordActionRef()
            setPswdSet(true)
            return
        }

        Vibration.vibrate(70, false);
        Alert.alert('', 'You entered the wrong password')
    }

    const setPswdUI = () => {
        if (!newPswdSet)
            return <ScrollView style={[styles.sheetScrollView, { height: Dimensions.get('window').height }]}>
                <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#fff', textAlign: 'center' }}>
                    <Icon name='ios-key-sharp' size={27} />
                    <View style={styles.space10} />
                    Set a password
                </Text>
                <View style={styles.space20} />
                <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 20 }}>This password will be required anytime you open the app. It can't be changed, making your notes stay private and secure</Text>

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
                <Text style={{ color: '#fff', textAlign: 'center', lineHeight: 20 }}>Add a password hint (optional)</Text>
                <View style={styles.space10} />

                <TextInput
                    value={pswdHint}
                    onChangeText={(val) => setPswdHint(val)}
                    keyboardType={'default'}
                    style={styles.pswdInput}
                    placeholder='eg. my date of birth'
                    placeholderTextColor='#f1f1f155'
                />
                <View style={{ width: 30, height: 30 }} />

                <TouchableOpacity style={{ backgroundColor: '#FF6666', padding: 20, borderRadius: 10 }} onPress={() => { setPswd() }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Done</Text>
                </TouchableOpacity>
            </ScrollView>

        else return <View style={{ paddingBottom: 40 }}>
            <View style={styles.space20} />
            <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#fff', textAlign: 'center' }}> Your password 👉🏼 {originalPassword.toLocaleLowerCase().trim()}  </Text>
            <View style={styles.space20} />
            <TouchableOpacity style={{ backgroundColor: '#FF6666', padding: 20, borderRadius: 10 }} onPress={() => { closeSetPasswordActionRef() }}>
                <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Awesome</Text>
            </TouchableOpacity>
        </View>
    }

    const checkPswdUI = () => {
        if (!pswdSet)
            return <ScrollView style={[styles.sheetScrollView, { height: Dimensions.get('window').height }]}>
                <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#fff', textAlign: 'center' }}>
                    <Icon name='ios-lock-closed' size={27} />
                    <View style={styles.space10} />
                    Enter your password
                </Text>

                <View style={styles.space20} />
                <Text style={{ color: '#fff', textAlign: 'center' }}>{pswdHint}</Text>
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

                <View style={{ width: 30, height: 30 }} />

                <TouchableOpacity onPress={() => { resetApp() }}>
                    <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Want to clear app data? Learn more</Text>
                </TouchableOpacity>
            </ScrollView>

        else return <></>

        // else return <View style={{ paddingBottom: 40 }}>
        //     <View style={styles.space20} />
        //     <Text style={{ fontWeight: 'bold', fontSize: 23, color: '#fff', textAlign: 'center' }}> Welcome back  </Text>
        //     <View style={styles.space20} />
        //     <TouchableOpacity style={{ backgroundColor: '#FF6666', padding: 20, borderRadius: 10 }} onPress={() => { closePasswordActionRef() }}>
        //         <Text style={{ fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Okay</Text>
        //     </TouchableOpacity>
        // </View>
    }

    return (
        <View style={{ flex: 1, backgroundColor: bgColor, paddingTop: Platform.OS === 'ios' ? 80 : 20 }}>
            <StatusBar backgroundColor={bgColor} barStyle="light-content" />

            <View style={{ paddingHorizontal: 20, paddingBottom: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 2, borderBottomColor: '#f1f1f111' }}>
                <Text style={{ fontSize: 23, color: '#fff', fontWeight: 'bold' }}>Mooody</Text>

                <TouchableOpacity onPress={() => lockApp()}>
                    <Icon name='ios-lock-closed' size={27} color='#fff' />
                </TouchableOpacity>

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

                <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', paddingBottom: 50 }}>
                    {/* <ScrollView> */}
                    <TouchableOpacity onPress={() => selectMood('😁', 'happy')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😁</Text>
                        <Text style={{ color: '#fff' }}>Happy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => selectMood('😕', 'confused')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😕</Text>
                        <Text style={{ color: '#fff' }}>Meh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => selectMood('😠', 'angry')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😠</Text>
                        <Text style={{ color: '#fff' }}>Angry</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => selectMood('😔', 'sad')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😔</Text>
                        <Text style={{ color: '#fff' }}>Sad</Text>
                    </TouchableOpacity>

                    {/*  */}

                    <TouchableOpacity onPress={() => selectMood('😨', 'afraid')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😨</Text>
                        <Text style={{ color: '#fff' }}>Fear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => selectMood('😱', 'surprised')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>😱</Text>
                        <Text style={{ color: '#fff' }}>Surprise</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={() => selectMood('🤢')} activeOpacity={0.7} style={styles.moodSelector}>
                        <Text style={{ fontSize: 50 }}>🤢</Text>
                        <Text style={{ color: '#fff' }}>Disgust</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={() => selectMood('🤢', 'disgusted')} activeOpacity={0.7} style={[styles.moodSelector, { width: '85%' }]}>
                        <Text style={{ fontSize: 50 }}>🤢</Text>
                        <Text style={{ color: '#fff' }}>Disgust</Text>
                    </TouchableOpacity>
                    {/* </ScrollView> */}
                </View>
            </ScrollView>

            <TouchableOpacity
                style={{ backgroundColor: '#FF6666', padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => navigation.navigate('AddNoteScreen')}>
                <Icon name='ios-add-sharp' size={30} color='#fff' />
                <Text style={{ textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>Add a note...</Text>
            </TouchableOpacity>

            <ActionSheet
                gestureEnabled={true}
                defaultOverlayOpacity={0}
                elevation={0}
                ref={passwordActionRef}
                closable={passwordSheetClosable}
                containerStyle={styles.sheetContainer}>

                {checkPswdUI()}
            </ActionSheet>

            <ActionSheet
                gestureEnabled={true}
                defaultOverlayOpacity={0}
                elevation={0}
                ref={setPasswordActionRef}
                closable={sheetClosable}
                containerStyle={styles.sheetContainer}>

                {setPswdUI()}
            </ActionSheet>
        </View >
    );
}

export default HomeScreen