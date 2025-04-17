import React from 'react';
import {NavigationProps} from '../../../types/navigationType.tsx';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Platform,
    PermissionsAndroid,
    NativeSyntheticEvent,
    TextInputContentSizeChangeEventData,
} from 'react-native';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import {Divider, Text, TopNavigationAction, useTheme} from '@ui-kitten/components';
import { launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import {errAlert} from '../../../component/Alert/err.tsx';

type ImageItem = {
    type: string | undefined;
    width: number | undefined;
    height: number | undefined;
    base64: string | undefined;
};

const PostTI: React.FC<NavigationProps> = ({ navigation }) => {
    const [textInput, setTextInput] = React.useState('');
    const [images, setImages] = React.useState<string[]>([]);
    const [imageData, setImageData] = React.useState<ImageItem[]>([]);
    const themes = useTheme();
    const [inputHeight, setInputHeight] = React.useState(200); // 初始高度

    const nextSelectTagsClick = () => {
        navigation.navigate('PostTags', { content: textInput, images: imageData });
    };

    const renderRightActions = (): React.ReactElement => {
        const nextIcon = (): React.ReactElement => {
            return (
                <Text style={{ color: themes['color-primary-500'] }}>下一步</Text>
            );
        };

        return (
            <TopNavigationAction
                icon={nextIcon}
                onPress={nextSelectTagsClick}
            />
        );
    };

    const handleContentSizeChange = (e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
        const newHeight = Math.max(200, e.nativeEvent.contentSize.height);
        setInputHeight(newHeight);

        // 滚动到底部保持输入可见
        // setTimeout(() => {
        //     scrollViewRef.current?.scrollToEnd({ animated: true });
        // }, 100);
    };

    const openImagePicker = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                selectionLimit: 0, // 0表示不限制选择数量
                includeBase64: true,
            });

            if (result.assets) {
                if (result.assets.length > 9) {
                    errAlert('最多只能选择9张图片');
                }
                const newImages = result.assets.map(asset => asset.uri || '').slice(0, 9);
                const newImageData: ImageItem[] = result.assets.map(asset => ({
                    type: asset.type,
                    width: asset.width,
                    height: asset.height,
                    base64: asset.base64,
                }));
                setImages([...images, ...newImages]);
                setImageData([...imageData, ...newImageData]);
            }
        } catch (error) {
            errAlert(error);
        }
    };

    // const toggleImagePicker = () => {
    //     setShowImagePicker(!showImagePicker);
    // };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const requestPermissions = async () => {
        try {
            if (Platform.OS === 'android') {
                // Android 13+ (API level 33+)
                if (Platform.Version >= 33) {
                    const status = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                    ]);
                    return (
                        status['android.permission.READ_MEDIA_IMAGES'] === PermissionsAndroid.RESULTS.GRANTED &&
                        status['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
                    );
                }
                // Android <13
                else {
                    const status = await PermissionsAndroid.requestMultiple([
                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                    ]);
                    return (
                        status['android.permission.READ_EXTERNAL_STORAGE'] === PermissionsAndroid.RESULTS.GRANTED &&
                        status['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED
                    );
                }
            }
            // iOS
            else {
                const photoLibraryStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
                if (photoLibraryStatus === RESULTS.DENIED) {
                    await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                }
                return photoLibraryStatus === RESULTS.GRANTED;
            }
        } catch (err) {
            console.warn('Permission request error:', err);
            return false;
        }
    };

    // 在组件中使用
    React.useEffect(() => {
        (async () => {
            await requestPermissions();
        })();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationOpe
                navigation={navigation}
                renderItemAccessory={renderRightActions}
                title={'发布帖子'}
            />

            <Divider />

            <ScrollView style={[styles.container, { backgroundColor: themes['background-basic-color-1'] }]}>
                <View style={styles.inputContainer}>
                    {textInput === ''}
                    <TextInput
                        value={textInput}
                        style={[styles.textInput, { height: inputHeight }]}
                        onChangeText={setTextInput}
                        onContentSizeChange={handleContentSizeChange}
                        placeholder="发点什么吧~和大家一起交流分享"
                        placeholderTextColor="#888"
                        multiline
                        textAlignVertical="top"
                        scrollEnabled={false}
                        maxLength={500}
                    />
                    <Text style={styles.chartCount}>{textInput.length}/500</Text>
                </View>

                {/* 已选图片预览 */}
                <View style={styles.imagesContainer}>
                    {images.map((uri, index) => (
                        <View key={index} style={styles.imageItemContainer}>
                            <Image source={{ uri }} style={styles.imageItem} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeImage(index)}
                            >
                                <Text style={styles.removeButtonText}>×</Text>
                            </TouchableOpacity>
                        </View>
                    ))}

                    {images.length < 9 && (
                        <TouchableOpacity
                            style={styles.addButton}
                            // onPress={toggleImagePicker}
                            onPress={openImagePicker}
                        >
                            <Text style={styles.plusText}>+</Text>
                            <Text style={{color: '#999'}}>添加图片</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            {/* 图片选择器模态框 */}
            {/*<Modal*/}
            {/*    visible={showImagePicker}*/}
            {/*    animationType="slide"*/}
            {/*    transparent={true}*/}
            {/*    onRequestClose={toggleImagePicker}*/}
            {/*>*/}
            {/*    <TouchableWithoutFeedback onPress={toggleImagePicker}>*/}
            {/*        <View style={styles.modalOverlay} />*/}
            {/*    </TouchableWithoutFeedback>*/}

            {/*    <View style={styles.modalContent}>*/}
            {/*        <View style={styles.modalHeader}>*/}
            {/*            <Text style={styles.modalTitle}>选择图片</Text>*/}
            {/*            <TouchableOpacity onPress={openImagePicker}>*/}
            {/*                <Text style={styles.modalActionText}>相册</Text>*/}
            {/*            </TouchableOpacity>*/}
            {/*        </View>*/}

            {/*        <FlatList*/}
            {/*            data={galleryImages}*/}
            {/*            numColumns={4}*/}
            {/*            keyExtractor={(item, index) => index.toString()}*/}
            {/*            renderItem={({ item }) => (*/}
            {/*                <TouchableOpacity*/}
            {/*                    style={styles.galleryImageItem}*/}
            {/*                    onPress={() => {*/}
            {/*                        setImages([...images, item.uri]);*/}
            {/*                        toggleImagePicker();*/}
            {/*                    }}*/}
            {/*                >*/}
            {/*                    <Image*/}
            {/*                        source={{ uri: item.uri }}*/}
            {/*                        style={styles.galleryImage}*/}
            {/*                    />*/}
            {/*                </TouchableOpacity>*/}
            {/*            )}*/}
            {/*        />*/}
            {/*    </View>*/}
            {/*</Modal>*/}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height: '100%',
    },
    inputContainer: {
        paddingHorizontal: 16,
        // paddingVertical: 16,
    },
    textInput: {
        fontSize: 16,
        lineHeight: 25,
        borderWidth: 0,
        // minHeight: 200,
        backgroundColor: 'transparent',
    },
    chartCount: {
        width: '100%',
        textAlign: 'right',
        color: '#999',
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
    },
    imageItemContainer: {
        width: '30%',
        aspectRatio: 1,
        margin: 5,
        position: 'relative',
    },
    imageItem: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
        resizeMode: 'cover',
    },
    addButton: {
        width: '30%',
        aspectRatio: 1,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        borderRadius: 4,
    },
    plusText: {
        fontSize: 40,
        color: '#999',
        marginBottom: 4,
    },
    removeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeButtonText: {
        color: 'white',
        fontSize: 18,
        lineHeight: 22,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        height: '40%',
        backgroundColor: 'white',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalActionText: {
        fontSize: 16,
        color: '#007AFF',
    },
});

export default PostTI;
