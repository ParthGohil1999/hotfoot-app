import { useState } from "react";
import { View } from "react-native";
import { SearchModal } from "../animatedExploreBar/SearchModal";


const ModalVisibility = (tabName) => {

    const [modalVisible, setModalVisible] = useState(false);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setModalVisible(true);
    };

    return (
        <View>
            <SearchModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                tabName={tabName} />
        </View>
    )

}

export default ModalVisibility
