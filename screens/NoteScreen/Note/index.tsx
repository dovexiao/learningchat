import React, {useEffect, useRef, useState} from 'react';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import { Divider, Button } from '@ui-kitten/components';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { NavigationProps } from '../../../types/navigationType.tsx';

const Note: React.FC<NavigationProps> = ({ navigation, route }) => {
    const { item } = route.params;
    const webViewRef = useRef<WebView | null>(null);
    const [isWebViewReady, setIsWebViewReady] = useState(false);
    const [editorState, setEditorState] = useState({
        delta: null,
        selection: null,
    });

    const safeInject = (script: string) => {
        if (webViewRef.current && isWebViewReady) {
            webViewRef.current.injectJavaScript(`
                if (!window.ReactNativeWebView) {
                    console.error('通信接口未就绪');
                    false;
                }
                ${script}
            `);
        }
    };

    // 加粗当前选中文本
    const handleBold = () => {
        safeInject(`
            const quill = window.quill;
            if (quill) {
                const range = quill.getSelection();
                if (range && range.length > 0) {
                    quill.format('bold', true);
                }
            }
            true;
        `);
    };

    useEffect(() => {
        return () => {
            // 组件卸载时清理
            if (webViewRef.current) {
                webViewRef.current.stopLoading();
                webViewRef.current = null;
            }
        };
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationOpe
                title={item.title}
                navigation={navigation}
                renderItemAccessory={() => (
                    <></>
                )}
            />
            <Divider />
            <View style={{ flex: 1 }}>
                <WebView
                    ref={webViewRef}
                    style={styles.webview}
                    source={{ uri: 'file:///android_asset/custom/quill-editor.html' }}
                    onLoadEnd={() => {
                        setIsWebViewReady(true);
                    }}
                    onMessage={e => {
                        try {
                            const msg = JSON.parse(e.nativeEvent.data);
                            if (msg.type === 'content-change' && msg.selection) {
                                console.log(msg);
                                setEditorState(msg);
                            }
                        } catch (err) {
                            console.error('消息解析失败:', err);
                        }
                    }}
                    // injectedJavaScriptBeforeContentStart={`
                    //     window.ReactNativeWebView = window.ReactNativeWebView || {};
                    //     true;
                    // `}
                    onError={(syntheticEvent) => {
                        const { nativeEvent } = syntheticEvent;
                        console.error('WebView 错误:', nativeEvent);
                    }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    startInLoadingState={true}
                />
            </View>
            <Button onPress={handleBold}>B</Button>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    webview: {
        flex: 1,
    },
});

export default Note;
