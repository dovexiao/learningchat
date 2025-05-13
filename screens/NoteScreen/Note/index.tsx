import React, {forwardRef, useRef, useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Pressable,
    Keyboard,
} from 'react-native';
import FontAwesome5 from '@react-native-vector-icons/fontawesome5';
import WebView from "react-native-webview";
import {NavigationProps} from "../../../types/navigationType.ts";
import {Divider, Layout} from "@ui-kitten/components";
import TopNavigationOpe from "../../../component/TopNavigation/TopNavigationOpe.tsx";

const Note: React.FC<NavigationProps> = ({ navigation, route }) => {
    const { item } = route.params;
    const editorToolRef = useRef<EditorToolRef>(null);

    React.useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                editorToolRef.current?.hideFormatPanel();
            }
        );

        return () => {
            keyboardDidShowListener.remove();
        };
    }, []);

    const setEditorToolsMethods = (methods: any) => {
        editorToolRef.current?.setEditorToolsMethods(methods);
    }

    const setSelectedNodeStatus = (status: any) => {
        editorToolRef.current?.setSelectedNodeStatus(status);
    }

    return (
        <Layout style={styles.container}>
            <TopNavigationOpe
                title={item.title}
                navigation={navigation}
                renderItemAccessory={() => (
                    <></>
                )}
            />
            <Divider />
            <Editor setEditorToolsMethods={setEditorToolsMethods} setSelectedNodeStatus={setSelectedNodeStatus} />
            <EditorTool ref={editorToolRef} />
        </Layout>
    );
};

interface EditorProps {
    setEditorToolsMethods: (methods: any) => void;
    setSelectedNodeStatus: (status: any) => void;
}

const Editor: React.FC<EditorProps> = ({ setEditorToolsMethods, setSelectedNodeStatus }) => {
    const webViewRef = useRef<WebView | null>(null);
    const [isWebViewReady, setIsWebViewReady] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    // 封装调用 WebView 中 JavaScript 方法的函数
    const callWebViewMethod = (methodName: string, ...args: any[]) => {
        if (isWebViewReady && webViewRef.current) {
            const argsStr = args.map(arg => JSON.stringify(arg)).join(',');
            const script = `if (typeof ${methodName} === 'function') { ${methodName}(${argsStr}); }`;
            // console.log(methodName, ...args, script);
            webViewRef.current.injectJavaScript(script);
        }
    };

    // 封装需要调用的方法
    const applyTextFormat = (format: string) => {
        // console.log(format)
        callWebViewMethod('applyTextFormat', format);
    };

    const applyTextAlignment = (alignment: string) => {
        callWebViewMethod('applyTextAlignment', alignment);
    };

    const undo = () => {
        callWebViewMethod('undo');
    };

    const redo = () => {
        callWebViewMethod('redo');
    };

    const applyIndent = () => {
        callWebViewMethod('applyIndent');
    };

    const removeIndent = () => {
        callWebViewMethod('removeIndent');
    };

    const createBlockquote = () => {
        callWebViewMethod('createBlockquote');
    };

    const createUnorderedList = () => {
        callWebViewMethod('createUnorderedList');
    };

    const createOrderedList = () => {
        callWebViewMethod('createOrderedList');
    };

    const applyHeading = (headingType: string) => {
        callWebViewMethod('applyHeading', headingType);
    };

    const applyTextColor = (color: string) => {
        callWebViewMethod('applyTextColor', color);
    };

    const applyBackgroundColor = (color: string) => {
        callWebViewMethod('applyBackgroundColor', color);
    };

    const editorToolMethods = {
        applyTextFormat,
        applyTextAlignment,
        undo,
        redo,
        applyIndent,
        removeIndent,
        createBlockquote,
        createUnorderedList,
        createOrderedList,
        applyHeading,
        applyTextColor,
        applyBackgroundColor,
    };

    React.useEffect(() => {
        setEditorToolsMethods(editorToolMethods);
    }, [editorToolMethods]);

    return (
        <View style={{ flex: 1 }}>
            <WebView
                ref={webViewRef}
                style={{ flex: 1 }}
                source={{ uri: 'file:///android_asset/custom/editor.html' }}
                originWhitelist={['*']}
                onLoadEnd={() => {
                    setIsWebViewReady(true);
                }}
                injectedJavaScriptBeforeContentLoaded={`
                    // 定义全局桥梁对象
                    window.RNBridge = {
                      // 接收 RN 指令的方法
                      onMessage: (callback) => {
                        window.rnMessageCallback = callback;
                      }
                    };
                    // 向 RN 发送消息的辅助函数
                    window.sendToRN = (data) => {
                      window.ReactNativeWebView.postMessage(JSON.stringify(data));
                    };
                `}
                onMessage={e => {
                    try {
                        const msg = JSON.parse(e.nativeEvent.data);
                        if (msg.type === 'SELECTED_NODE') {
                            setSelectedNodeStatus(msg.body);
                            console.log(msg.body);
                        } else if (msg.type === 'EDITOR_HTML') {
                            setEditorContent(msg.body);
                            console.log(msg.body);
                        }
                    } catch (err) {
                        console.error('消息解析失败:', err);
                    }
                }}
                onError={(syntheticEvent) => {
                    const { nativeEvent } = syntheticEvent;
                    console.error('WebView error:', nativeEvent);
                }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
            />
        </View>
    );
};


// 定义选中节点的类型
type SelectedNode = {
    isBold: boolean;
    isItalic: boolean;
    isUnderline: boolean;
    isStrikethrough: boolean;
    alignment: 'left' | 'center' | 'right' | 'none';
    listType: 'unordered' | 'ordered' | 'none';
    isIndented: boolean;
    isQuote: boolean;
    headingLevel: 'h1' | 'h2' | 'h3' | 'p' | 'none';
    ftColor: string;
    bgColor: string;
};

// 定义EditorTool的ref接口
interface EditorToolRef {
    hideFormatPanel: () => void;
    setEditorToolsMethods: (methods: any) => void;
    setSelectedNodeStatus: (node: SelectedNode) => void;
}

const EditorTool = forwardRef<EditorToolRef, {}>((props, ref) => {
    const [activeTab, setActiveTab] = useState<string>('none');
    const [selectedNode, setSelectedNode] = useState<SelectedNode>({
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrikethrough: false,
        alignment: 'none',
        listType: 'none',
        isIndented: false,
        isQuote: false,
        headingLevel: 'none',
        ftColor: '',
        bgColor: '',
    });
    const [editorToolsMs, setEditorToolsMs] = useState<any>({});

    // 绑定ref暴露相关方法
    React.useImperativeHandle(ref, () => ({
        hideFormatPanel,
        setEditorToolsMethods,
        setSelectedNodeStatus,
    }));

    // 隐藏面板
    const hideFormatPanel = () => {
        setActiveTab('none');
    };

    // 设置工具类方法
    const setEditorToolsMethods = (methods: any) => {
        setEditorToolsMs(methods);
    };

    // 设置选中节点状态
    const setSelectedNodeStatus = (node: SelectedNode) => {
        setSelectedNode(node);
        console.log(node);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    // 处理二元状态的格式化选项（开/关）
    // const toggleFormat = (key: keyof Omit<SelectedNode, 'alignment' | 'listType' | 'headingLevel'>) => {
    //     setSelectedNode(prev => ({
    //         ...prev,
    //         [key]: !prev[key],
    //     }));
    // };

    // 处理多选项状态（如对齐方式、列表类型、标题级别）
    // const setMultiOptionFormat = <K extends 'alignment' | 'listType' | 'headingLevel'>(
    //     key: K,
    //     value: SelectedNode[K]
    // ) => {
    //     setSelectedNode(prev => ({
    //         ...prev,
    //         [key]: value,
    //     }));
    // };

    return (
        <View style={styles.editorContainer}>
            {/* 主要工具栏 */}
            <View style={styles.mainToolbar}>
                {/* 主要工具栏选项卡 */}
                <View style={styles.mainTabs}>
                    <Pressable
                        style={[
                            styles.mainTab,
                            activeTab === 'text' && styles.activeTab,
                        ]}
                        onPress={() => handleTabChange('text')}
                    >
                        <FontAwesome5 iconStyle="solid" name="font" size={18} color={activeTab === 'text' ? '#f35221' : '#000'} />
                    </Pressable>
                    <Pressable
                        style={[
                            styles.mainTab,
                            activeTab === 'paragraph' && styles.activeTab,
                        ]}
                        onPress={() => handleTabChange('paragraph')}
                    >
                        <FontAwesome5 iconStyle="solid" name="paragraph" size={18} color={activeTab === 'paragraph' ? '#f35221' : '#000'} />
                    </Pressable>
                    <Pressable style={styles.mainTab} onPress={() => editorToolsMs.undo()}>
                        <FontAwesome5 iconStyle="solid" name="undo" size={18} color="#000" />
                    </Pressable>
                    <Pressable style={styles.mainTab} onPress={() => editorToolsMs.redo()}>
                        <FontAwesome5 iconStyle="solid" name="redo" size={18} color="#000" />
                    </Pressable>
                </View>

                {/* 文本格式化面板 */}
                <View style={[styles.formatPanel, activeTab === 'text' && styles.activeFormatPanel]}>
                    {/* 子组1: 文本格式 */}
                    <View style={styles.subgroup}>
                        <Text style={styles.subgroupLabel}>文本格式</Text>
                        <View style={styles.subgroupTools}>
                            <Pressable
                                style={[styles.toolButton, selectedNode.isBold && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.applyTextFormat(`${selectedNode.isBold ? 'no-bold' : 'bold'}`);
                                    // toggleFormat('isBold');
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="bold" size={20} color="#555" />
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, selectedNode.isItalic && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.applyTextFormat(`${selectedNode.isItalic ? 'no-italic' : 'italic'}`);
                                    // toggleFormat('isItalic')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="italic" size={20} color="#555" />
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, selectedNode.isUnderline && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.applyTextFormat(`${selectedNode.isUnderline ? 'no-underline' : 'underline'}`);
                                    // toggleFormat('isUnderline')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="underline" size={20} color="#555" />
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, selectedNode.isStrikethrough && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.applyTextFormat(`${selectedNode.isStrikethrough ? 'no-strikethrough' : 'strikethrough'}`);
                                    // toggleFormat('isStrikethrough')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="strikethrough" size={20} color="#555" />
                            </Pressable>
                        </View>
                    </View>

                    {/* 子组2: 文本颜色 */}
                    <View style={styles.subgroup}>
                        <Text style={styles.subgroupLabel}>文本颜色</Text>
                        <View style={styles.subgroupTools}>
                            <Pressable
                                style={[styles.toolButton, styles.colorButton]}
                                id="text-color"
                            >
                                <FontAwesome5 iconStyle="solid" name="font" size={20} color="#555" />
                                <View
                                    style={[
                                        styles.colorIndicator,
                                        { backgroundColor: selectedNode.ftColor || '#000' },
                                    ]}
                                />
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, styles.colorButton]}
                                id="bg-color"
                            >
                                <FontAwesome5 iconStyle="solid" name="fill-drip" size={20} color="#555" />
                                <View
                                    style={[
                                        styles.colorIndicator,
                                        { backgroundColor: selectedNode.bgColor || '#fff' },
                                    ]}
                                />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* 段落格式化面板 */}
                <View style={[styles.formatPanel, activeTab === 'paragraph' && styles.activeFormatPanel]}>
                    {/* 子组1: 对齐方式 */}
                    <View style={styles.subgroup}>
                        <Text style={styles.subgroupLabel}>对齐方式</Text>
                        <View style={styles.subgroupTools}>
                            <Pressable
                                style={[styles.toolButton, (selectedNode.alignment === 'left' || selectedNode.alignment === 'none') && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.applyTextAlignment('left');
                                    // setMultiOptionFormat('alignment', 'left')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="align-left" size={23} color="#555" />
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, selectedNode.alignment === 'center' && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.applyTextAlignment('center');
                                    // setMultiOptionFormat('alignment', 'center')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="align-center" size={23} color="#555" />
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, selectedNode.alignment === 'right' && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.applyTextAlignment('right');
                                    // setMultiOptionFormat('alignment', 'right')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="align-right" size={23} color="#555" />
                            </Pressable>
                        </View>
                    </View>

                    {/* 子组2: 排序 */}
                    <View style={styles.subgroup}>
                        <Text style={styles.subgroupLabel}>排序</Text>
                        <View style={styles.subgroupTools}>
                            <Pressable
                                style={[styles.toolButton, selectedNode.listType === 'unordered' && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.createUnorderedList();
                                    // setMultiOptionFormat('listType', 'unordered')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="list-ul" size={25} color="#555" />
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, selectedNode.listType === 'ordered' && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.createOrderedList();
                                    // setMultiOptionFormat('listType', 'ordered')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="list-ol" size={25} color="#555" />
                            </Pressable>
                        </View>
                    </View>

                    {/* 子组3: 缩进 */}
                    <View style={styles.subgroup}>
                        <Text style={styles.subgroupLabel}>缩进</Text>
                        <View style={styles.subgroupTools}>
                            <Pressable
                                style={[styles.toolButton, selectedNode.isIndented && styles.activeToolButton]}
                                onPress={() => {
                                    selectedNode.isIndented ? editorToolsMs.removeIndent() : editorToolsMs.applyIndent();
                                    // toggleFormat('isIndented')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="indent" size={25} color="#555" />
                            </Pressable>
                        </View>
                    </View>

                    {/* 子组4: 引用 */}
                    <View style={styles.subgroup}>
                        <Text style={styles.subgroupLabel}>引用</Text>
                        <View style={styles.subgroupTools}>
                            <Pressable
                                style={[styles.toolButton, selectedNode.isQuote && styles.activeToolButton]}
                                onPress={() => {
                                    editorToolsMs.createBlockquote();
                                    // toggleFormat('isQuote')
                                }}
                            >
                                <FontAwesome5 iconStyle="solid" name="quote-right" size={18} color="#555" />
                            </Pressable>
                        </View>
                    </View>

                    {/* 子组5: 标题 */}
                    <View style={styles.subgroup}>
                        <Text style={styles.subgroupLabel}>标题</Text>
                        <View style={styles.subgroupTools}>
                            <Pressable
                                style={[styles.toolButton, selectedNode.headingLevel === 'h1' && styles.activeToolButton]}
                                onPress={() => {
                                    (selectedNode.headingLevel !== 'none' && selectedNode.headingLevel !== 'p') ? editorToolsMs.applyHeading('default') : editorToolsMs.applyHeading('h1');
                                    // setMultiOptionFormat('headingLevel', 'h1')
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#555" }}>H1</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, selectedNode.headingLevel === 'h2' && styles.activeToolButton]}
                                onPress={() => {
                                    (selectedNode.headingLevel !== 'none' && selectedNode.headingLevel !== 'p') ? editorToolsMs.applyHeading('default') : editorToolsMs.applyHeading('h2');
                                    // setMultiOptionFormat('headingLevel', 'h2')
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#555" }}>H2</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.toolButton, selectedNode.headingLevel === 'h3' && styles.activeToolButton]}
                                onPress={() => {
                                    (selectedNode.headingLevel !== 'none' && selectedNode.headingLevel !== 'p') ? editorToolsMs.applyHeading('default') : editorToolsMs.applyHeading('h3');
                                    // setMultiOptionFormat('headingLevel', 'h3')
                                }}
                            >
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: "#555" }}>H3</Text>
                            </Pressable>
                            {/*<Pressable*/}
                            {/*    style={[styles.toolButton, selectedNode.headingLevel === 'none' && styles.activeToolButton]}*/}
                            {/*    onPress={() => setMultiOptionFormat('headingLevel', 'none')}*/}
                            {/*>*/}
                            {/*    <Text style={{ color: "#555" }}>P</Text>*/}
                            {/*</Pressable>*/}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    editorContainer: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
    },
    mainToolbar: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#ffffff',
        flexDirection: 'column',
    },
    mainTabs: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    mainTab: {
        flex: 1,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#f35221',
    },
    formatPanel: {
        display: 'none',
        padding: 15,
        gap: 16,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    activeFormatPanel: {
        display: 'flex',
    },
    subgroup: {
        flexDirection: 'column',
        gap: 8,
    },
    subgroupLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    subgroupTools: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: '#f3f3f3',
    },
    toolButton: {
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        color: '#000000',
    },
    activeToolButton: {
        backgroundColor: '#e3e3e3',
    },
    colorButton: {
        position: 'relative',
    },
    colorIndicator: {
        position: 'absolute',
        bottom: 12,
        width: 25,
        height: 4,
        borderRadius: 2,
    },
});

export default Note;
