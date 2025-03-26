import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import * as Progress from 'react-native-progress';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const TopBar = ({backarrow, logo, progress, text, rightIcons}) => {
    return (
        <View>
            <View style={styles.topBar}>
                <View style={styles.leftButtonContainer}>
                    {backarrow && <Ionicons name="arrow-back" size={25} color="black" />}
                    {logo && <Image style={[styles.image]} source={require('../../assets/images/icon.png')} />}
                </View>
                {progress && <Progress.Bar progress={progress} width={180} height={9} backgroundColor='#ddd' borderWidth={0} color="black" />}
                {text && <Text style={styles.title}>{text}</Text>}
                {rightIcons && <View style={styles.rightButtonContainer}>
                    {rightIcons.includes("search") && <Feather name="search" size={25} color="black" />}
                    {rightIcons.includes("save") && <Feather name="bookmark" size={25} color="black" />}
                    {rightIcons.includes("share") && <Feather name="share-2" size={25} color="black" />}
                    {rightIcons.includes("options") && <Feather name="more-vertical" size={25} color="black" />}
                    {rightIcons.includes("add") && <Feather name="plus" size={25} color="black" />}
                    {rightIcons.includes("scanner") && <MaterialCommunityIcons name="credit-card-scan-outline" size={25} color="black" />}
                </View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        backgroundColor: 'transparent',

        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd',
    },
    image:{
        height:35,
        width:35,
        borderRadius: 100,
    },
    leftButtonContainer: { // New style for back button positioning
        flex: 0, // This prevents the container from expanding to fill the space
        left: 20, // Adjust margin as needed for spacing
        position: 'absolute',
        flexDirection: 'row',
    },
    rightButtonContainer: {
        right: 25, // Adjust margin as needed for spacing
        position: 'absolute',
        flexDirection: 'row',
    },
    title: {
        fontSize: 20,
        color: 'black',
        fontWeight: 700,

    },
})

export default TopBar