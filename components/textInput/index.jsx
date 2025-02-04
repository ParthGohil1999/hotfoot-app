import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

const Input = () => {
    return (
        <View>
            <TextInput
                style={styles.input}
                className="px-10"
            />
        </View>
    )
}

const styles = StyleSheet.create({
    input: {
        justifyContent: "center",
        // backgroundColor: '#f9f9f9',
        borderColor: '#f1f1f1', // Light gray background
        borderWidth: 1,
        borderRadius: 15, // Rounded corners
        paddingHorizontal: 17,
        marginBottom: 20,
        fontSize: 15,
        fontWeight: 500,
        height: 50,
    },
})

export default Input