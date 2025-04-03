import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const TitleSubtitle = ({ title, subtitle }) => {
    return (
        <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>
                {subtitle}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({

    title: {
        fontSize: 30,
        color: 'black',
        fontWeight: 700,
        marginTop: 20,
    },

    subtitle: {
        fontSize: 15,
        fontWeight: 350,
        marginVertical: 15,
        color: '#555555',
        lineHeight: 22,
    },
})

export default TitleSubtitle