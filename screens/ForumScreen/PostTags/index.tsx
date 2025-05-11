import React, { useState } from 'react';
import {NavigationProps} from '../../../types/navigationType.ts';
import {SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import TopNavigationOpe from '../../../component/TopNavigation/TopNavigationOpe.tsx';
import {Divider, Input, Text, TopNavigationAction, useTheme} from '@ui-kitten/components';
import * as ForumApi from '../../../services/api/ForumApi.ts';
import * as ResourceApi from '../../../services/api/ResourceApi.ts';
import {useAuth} from '../../../hooks/AuthContext.tsx';
import {errAlert} from '../../../component/Alert/err.tsx';

type tagProps = {
    tagId: number;
    content: string;
    participants: number;
};

const PostTags: React.FC<NavigationProps> = ({ navigation, route }) => {
    const themes = useTheme();
    const [searchText, setSearchText] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [recentTags, setRecentTags] = useState<string[]>([]);
    const [recommendedTags, setRecommendedTags] = useState<tagProps[]>([]);
    const [searchResults, setSearchResults] = useState<tagProps[]>([]);
    const { userId } = useAuth().getUser();
    const { content, images } = route.params;

    // Mock search function
    const handleSearch = async (text: string) => {
        try {
            setSearchText(text);
            if (text) {
                const { tags } = await ForumApi.getTagsByContent(text);
                setSearchResults(tags);
            }
        } catch(error) {
            errAlert(error);
        }
    };

    const handleTagPress = async (tag: string) => {
        if (!selectedTags.includes(tag)) {
            setSelectedTags([...selectedTags, tag]);
        }
        setSearchText('');
    };

    const handleNewTagPress = async (tag: string) => {
        try {
            await ForumApi.createTag(tag);
            if (!selectedTags.includes(tag)) {
                setSelectedTags([...selectedTags, tag]);
            }
            setSearchText('');
        } catch(error) {
            errAlert(error);
        }
    };

    const handleRemoveTag = (tag: string) => {
        setSelectedTags(selectedTags.filter(t => t !== tag));
    };

    const handleReleaseClick = async () => {
        try {
            const imageIds: number[] = await Promise.all(images.map(async (image: any) => {
                const { imageId } = await ResourceApi.uploadImage(image);
                return imageId;
            }));
            await ForumApi.createPost(userId, content, selectedTags, imageIds);
            navigation.pop(2);
        } catch(error) {
            errAlert(error);
        }
    };

    const renderRightActions = (): React.ReactElement => (
        <TopNavigationAction
            icon={() => <Text style={{ color: themes['color-primary-500'] }}>发布</Text>}
            onPress={handleReleaseClick}
        />
    );

    const accessoryLeft = (): React.ReactElement => (
        <Text style={[styles.hashTag, { color: themes['color-primary-500'], borderColor: themes['color-primary-500'] }]}>
            #
        </Text>
    );

    const renderTag = (tag: string, isSelected: boolean, showRemove: boolean = false) => (
        <TouchableOpacity
            key={tag}
            style={[styles.tag, isSelected ? styles.selectedTag : styles.unselectedTag]}
            onPress={() => isSelected ? null : handleTagPress(tag)}
        >
            <Text style={[styles.tagText, isSelected && { color: themes['color-primary-500'] }]}>
                # {tag}
            </Text>
            {showRemove && (
                <TouchableOpacity onPress={() => handleRemoveTag(tag)}>
                    <Text style={[styles.removeText, { color: themes['color-primary-500'] }]}>×</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );

    const renderSearchResult = (tag: any) => (
        <TouchableOpacity
            key={tag.tagId}
            style={styles.searchResultItem}
            onPress={() => handleTagPress(tag.content)}
        >
            <Text style={styles.searchResultText}># {tag.content}</Text>
            <View style={styles.participationContainer}>
                <Text style={styles.participationText}>{tag.participants}参与</Text>
            </View>
        </TouchableOpacity>
    );

    const renderNewTag = () => {
        if (!searchText || searchResults.map(tag => tag.content).includes(searchText)) {
            return (
                <></>
            );
        }

        return (
            <View style={{ backgroundColor: themes['background-basic-color-1'] }}>
                <TouchableOpacity
                    style={styles.newTagContainer}
                    onPress={() => handleNewTagPress(searchText)}
                >
                    <Text style={styles.newTagText}># {searchText}</Text>
                    <View style={styles.newTagBadge}>
                        <Text style={styles.newTagBadgeText}>新圈子</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const getRecentTags = React.useCallback(async () => {
        try {
            const { tags } = await ForumApi.getRecentTags(userId);
            setRecentTags(tags);
        } catch(error) {
            errAlert(error);
        }
    }, [userId]);

    const getRecommendedTags = React.useCallback(async () => {
        try {
            const { tags } = await ForumApi.getRecommendedTags(userId);
            setRecommendedTags(tags);
        } catch(error) {
            errAlert(error);
        }
    }, [userId]);

    React.useEffect(() => {
        (async () => {
            await getRecentTags();
            await getRecommendedTags();
        })();
    }, [getRecentTags, getRecommendedTags]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <TopNavigationOpe
                navigation={navigation}
                renderItemAccessory={renderRightActions}
                title={'发布帖子'}
            />

            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <Input
                        placeholder="找不到合适的圈子吗?来这里搜索、创建圈子"
                        accessoryLeft={accessoryLeft}
                        style={styles.input}
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            <ScrollView style={[styles.container, { backgroundColor: themes['background-basic-color-1'] }]}>
                <View style={styles.contentContainer}>
                    {!searchText ? (
                        <>
                            {/* Selected Tags */}
                            {selectedTags.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>已选择</Text>
                                    <View style={styles.tagsContainer}>
                                        {selectedTags.map(tag => renderTag(tag, true, true))}
                                    </View>
                                </View>
                            )}

                            {/* Recent Tags */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>最近使用</Text>
                                <View style={styles.tagsContainer}>
                                    {recentTags.map(tag => renderTag(tag, selectedTags.includes(tag)))}
                                </View>
                            </View>

                            {/* Recommended Tags */}
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>希望帖子出现在哪些圈子里</Text>
                                <View style={styles.tagsContainer}>
                                    {recommendedTags.map(tag => renderTag(tag.content, selectedTags.includes(tag.content)))}
                                </View>
                            </View>
                        </>
                    ) : (
                        <>
                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <View style={styles.section}>
                                    {/*<Text style={styles.sectionTitle}>搜索结果</Text>*/}
                                    <View style={styles.searchResultsContainer}>
                                        {searchResults.map(tag => renderSearchResult(tag))}
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>

            <Divider />

            {/* New Tag */}
            {searchText && renderNewTag()}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        padding: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        backgroundColor: '#fff',
    },
    inputWrapper: {
        flex: 1,
        marginRight: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        borderWidth: 0,
    },
    hashTag: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        textAlign: 'center',
        textAlignVertical: 'center',
        lineHeight: 20,
    },
    section: {
        flex: 1,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        borderWidth: 0,
        marginBottom: 8,
    },
    selectedTag: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 0,
    },
    unselectedTag: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },
    tagText: {
        fontSize: 14,
    },
    removeText: {
        marginLeft: 6,
        fontSize: 16,
        color: '#999',
    },
    searchResultsContainer: {
        gap: 12,
    },
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingVertical: 10,
    },
    searchResultText: {
        fontSize: 16,
        marginRight: 8,
    },
    participationContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingVertical: 4,
        paddingHorizontal: 10,
        // borderRadius: 12,
    },
    participationText: {
        fontSize: 12,
        color: '#666',
    },
    newTagContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    newTagText: {
        fontSize: 16,
        marginRight: 10,
    },
    newTagBadge: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        paddingVertical: 4,
        paddingHorizontal: 8,
        // borderRadius: 12,
    },
    newTagBadgeText: {
        fontSize: 12,
        color: '#666',
    },
});

export default PostTags;
